/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResultAmqpDto, ImageInformationAmqpDto, ImageInformationFilterAmqpDto, ImageMessagePattern } from '@ap4/amqp';
import { ImageInformationDto, ReadImageDto, UploadImageDto } from '@ap4/api';
import { DefaultBundleId, DocumentUploadType } from '@ap4/utils';
import { TokenReadDto } from 'nft-folder-blockchain-connector-besu';
import { Body, Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ImagesService } from './images.service';

@Controller()
export class ImagesController {
  private readonly logger: Logger = new Logger(ImagesController.name);

  constructor(private readonly imagesService: ImagesService) {}

  @MessagePattern(ImageMessagePattern.GET_IMAGE)
  public getImage(@Payload() uuid: string): Promise<ReadImageDto> {
    return this.imagesService.getImage(uuid);
  }

  @MessagePattern(ImageMessagePattern.GET_IMAGE_INFORMATION)
  public getImageInformation(@Payload() uuid: string): Promise<ImageInformationDto> {
    return this.imagesService.getImageInformation(uuid);
  }

  @MessagePattern(ImageMessagePattern.GET_IMAGE_NFT)
  public getImageNft(@Payload() uuid: string): Promise<TokenReadDto> {
    return this.imagesService.getImageNft(uuid);
  }

  @MessagePattern(ImageMessagePattern.GET_ALL_IMAGE_INFORMATION)
  public getAllImageInformation(@Payload() imageInformationFilterAmqpDto: ImageInformationFilterAmqpDto): Promise<ImageInformationDto[]> {
    return this.imagesService.getAllImageInformation(imageInformationFilterAmqpDto);
  }

  @MessagePattern(ImageMessagePattern.UPLOAD_NEW_IMAGE)
  public uploadImage(@Body() uploadImageDto: UploadImageDto): Promise<ImageInformationDto> {
    if (!uploadImageDto.documentUploadType) {
      uploadImageDto.documentUploadType = DocumentUploadType.JPEG;
    }
    if (!uploadImageDto.bundleId) {
      uploadImageDto.bundleId = DefaultBundleId;
    }
    return this.imagesService.uploadImage(uploadImageDto);
  }

  @MessagePattern(ImageMessagePattern.UPDATE_IMAGE_INFORMATION)
  public updateImageInformation(@Body() imageInformationDto: ImageInformationDto): Promise<ImageInformationAmqpDto> {
    return this.imagesService.updateImageInformation(imageInformationDto);
  }

  @MessagePattern(ImageMessagePattern.REMOVE_IMAGE)
  public removeImage(@Payload() uuid: string): Promise<boolean> {
    return this.imagesService.removeImage(uuid);
  }

  @MessagePattern(ImageMessagePattern.ANALYZE_BUNDLE)
  public analyzeImageBundle(@Payload() uuid: string): Promise<boolean> {
    return this.imagesService.analyzeImageBundle(uuid);
  }

  @MessagePattern(ImageMessagePattern.PUBLISH_ANALYSIS)
  public saveAnalysisResult(@Body() analysisResultAmqpDto: AnalysisResultAmqpDto): Promise<ImageInformationAmqpDto> {
    this.logger.log('Save analysis result');
    return this.imagesService.saveAnalysisResult(analysisResultAmqpDto);
  }
}
