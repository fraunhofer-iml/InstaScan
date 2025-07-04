/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import {
  AnalysisResultAmqpDto,
  ImageInformationAmqpDto, UploadImageAmqpDto
} from '@ap4/amqp';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageDto, ImageInformationDto } from '@ap4/api';
import { AnalysisStatus, DocumentTypeId } from '@ap4/utils';
import { ImageInformation } from '../entities/image.Information';
import type { Readable as ReadableStream } from 'node:stream';
import process from 'node:process';

@Injectable()
export class ImagesService implements OnModuleInit {

  private readonly logger = new Logger(ImagesService.name);

  constructor(
    private readonly s3Service: MinioService,
    @InjectRepository(ImageInformation)
    readonly imageInformationRepository: Repository<ImageInformation>
  ) {}

  async onModuleInit(): Promise<void> {
    if(process.env.CLEAR_DB_ON_START.toLowerCase() === 'true'){
      this.logger.log('clear database');
      await this.imageInformationRepository.clear();
    }
  }

  public async getImage(uuid: string): Promise<ImageDto> {
    const foundImageInformation: ImageInformationDto = await this.getImageInformation(uuid);
    if(!foundImageInformation){
      return null;
    }
    const s3FileName = `${foundImageInformation.uuid}.jpeg`;
    const objectResult: ReadableStream = await this.s3Service.client.getObject(process.env.S3_BUCKET, s3FileName);
    const pictureBuffer: Buffer = await new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      objectResult.on('data', (chunk) => chunks.push(chunk));
      objectResult.on('end', () => resolve(Buffer.concat(chunks)));
      objectResult.on('error', () => reject(new Error('Could not read content')));
    });
    return new ImageDto(pictureBuffer.toString('base64'));
  }

  public async getImageInformation(uuid: string): Promise<ImageInformationDto> {
    const foundImage: ImageInformation = await this.imageInformationRepository.findOne({where: {uuid: uuid}});
    return foundImage ? foundImage.toImageInformationDto() : null;
  }

  public async getAllImageInformation(): Promise<ImageInformationDto[]> {
    const storedImageInformation: ImageInformation[] = await this.imageInformationRepository.find();
    return storedImageInformation.map((imageInformation: ImageInformation) => imageInformation.toImageInformationDto());
  }

  public async uploadImage(body: UploadImageAmqpDto): Promise<ImageInformationDto> {
    if (!await this.s3Service.client.bucketExists(process.env.S3_BUCKET)) {
      await this.s3Service.client.makeBucket(process.env.S3_BUCKET);
    }
    try{
      const s3FileName = `${body.uuid}.jpeg`;
      const fileBuffer: Buffer = Buffer.from(body.image_base64, 'base64');
      await this.s3Service.client.putObject(process.env.S3_BUCKET, s3FileName, fileBuffer);

      const newImageInformation: ImageInformation = new ImageInformation(
        body.uuid,
        `${process.env.MINIO_STORAGE_URL}${s3FileName}`,
        new Date(),
        new Date(),
        AnalysisStatus.IN_PROGRESS,
        DocumentTypeId.CMR,
        ''
      );
      return this.imageInformationRepository.save(newImageInformation).then((result: ImageInformation) => result.toImageInformationDto());
    }
    catch(e){
      this.logger.error('Could not upload image', e);
      return null;
    }
  }

  public async updateImageInformation(imageInformationDto: ImageInformationDto): Promise<ImageInformationAmqpDto> {
    const foundImage = await this.getImageInformation(imageInformationDto.uuid);
    if (!foundImage) {
      return null;
    }
    foundImage.image_analysis_result = imageInformationDto.image_analysis_result;
    return this.imageInformationRepository.save(foundImage);
  }

  public async saveAnalysisResult(analysisResultAmqpDto: AnalysisResultAmqpDto): Promise<ImageInformationAmqpDto> {
    const foundImageInformation: ImageInformationDto = await this.getImageInformation(analysisResultAmqpDto.uuid);

    const analysisResult: any = analysisResultAmqpDto.image_analysis_result;
    if(analysisResult.status && analysisResult.status=='error'){
      foundImageInformation.analysisStatus = AnalysisStatus.FAILED;
    }
    else{
      foundImageInformation.analysisStatus = AnalysisStatus.FINISHED;
    }
    foundImageInformation.image_analysis_result = analysisResult;

    return this.imageInformationRepository.save(foundImageInformation);
  }

}
