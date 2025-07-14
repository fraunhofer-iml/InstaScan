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
import { ANALYSIS_INITIAL_RESULT, AnalysisStatus, DocumentTypeId } from '@ap4/utils';
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
  ) { }

  async onModuleInit(): Promise<void> {
    if (process.env.CLEAR_DB_ON_START.toLowerCase() === 'true') {
      this.logger.log('clear database');
      await this.imageInformationRepository.clear();
    }
  }

  public async getImage(uuid: string): Promise<ImageDto> {
    const foundImageInformation: ImageInformationDto = await this.getImageInformationDto(uuid);
    if (!foundImageInformation) {
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

  private async getImageInformation(uuid: string): Promise<ImageInformation> {
    return this.imageInformationRepository.findOne({
      where: { uuid: uuid },
    });
  }

  public async getImageInformationDto(
    uuid: string
  ): Promise<ImageInformationDto> {
    const foundImage: ImageInformation = await this.getImageInformation(
      uuid
    );
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
    try {
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
        ANALYSIS_INITIAL_RESULT
      );
      return this.imageInformationRepository.save(newImageInformation).then((result: ImageInformation) => result.toImageInformationDto());
    }
    catch (e) {
      this.logger.error('Could not upload image', e);
      return null;
    }
  }

  public async updateImageInformation(
    imageInformationDto: ImageInformationDto
  ): Promise<ImageInformationAmqpDto> {
    const foundImage = await this.getImageInformation(
      imageInformationDto.uuid
    );
    if (!foundImage) {
      return null;
    }
    foundImage.image_analysis_result = JSON.stringify(
      imageInformationDto.image_analysis_result
    );
    foundImage.analysisStatus = imageInformationDto.analysisStatus;
    const updateImage: ImageInformation =
      await this.imageInformationRepository.save(foundImage);
    return updateImage.toImageInformationAmqpDto();
  }

  public async saveAnalysisResult(
    analysisResultAmqpDto: AnalysisResultAmqpDto
  ): Promise<ImageInformationAmqpDto> {
    const foundImageInformation: ImageInformation = await this.getImageInformation(analysisResultAmqpDto.uuid);

    if ('error_details' in analysisResultAmqpDto.image_analysis_result) {
      foundImageInformation.analysisStatus = AnalysisStatus.FAILED;
    } else {
      foundImageInformation.analysisStatus = AnalysisStatus.FINISHED;
    }
    foundImageInformation.image_analysis_result =
      JSON.stringify(analysisResultAmqpDto.image_analysis_result);
    const updateImage: ImageInformation =
      await this.imageInformationRepository.save(foundImageInformation);
    return updateImage.toImageInformationAmqpDto();
  }

}
