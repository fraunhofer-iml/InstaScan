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

  /**
   * Retrieves the raw image file for the given UUID via AMQP.
   * @param uuid Unique identifier of the image.
   * @returns The stored image data.
   */
  @MessagePattern(ImageMessagePattern.GET_IMAGE)
  public getImage(@Payload() uuid: string): Promise<ReadImageDto> {
    return this.imagesService.getImage(uuid);
  }

  /**
   * Retrieves metadata and analysis information for an image.
   * @param uuid Unique identifier of the image.
   * @returns The image metadata.
   */
  @MessagePattern(ImageMessagePattern.GET_IMAGE_INFORMATION)
  public getImageInformation(@Payload() uuid: string): Promise<ImageInformationDto> {
    return this.imagesService.getImageInformation(uuid);
  }

  /**
   * Retrieves the NFT metadata linked to an image.
   * @param uuid Unique identifier of the image.
   * @returns NFT/token metadata.
   */
  @MessagePattern(ImageMessagePattern.GET_IMAGE_NFT)
  public getImageNft(@Payload() uuid: string): Promise<TokenReadDto> {
    return this.imagesService.getImageNft(uuid);
  }

  /**
   * Retrieves all image metadata entries matching the given filter via AMQP transport.
   * @param imageInformationFilterAmqpDto Filter DTO.
   * @returns Filtered image metadata list.
   */
  @MessagePattern(ImageMessagePattern.GET_ALL_IMAGE_INFORMATION)
  public getAllImageInformation(@Payload() imageInformationFilterAmqpDto: ImageInformationFilterAmqpDto): Promise<ImageInformationDto[]> {
    return this.imagesService.getAllImageInformation(imageInformationFilterAmqpDto);
  }

  /**
   * Uploads a new image (file + metadata) through AMQP.
   * Ensures default values for missing documentUploadType and bundleId.
   * @param uploadImageDto DTO containing upload payload.
   * @returns Created image metadata object.
   */
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

  /**
   * Updates metadata for an existing image and returns the AMQP-ready DTO
   * @param imageInformationDto Updated metadata.
   * @returns Updated metadata event DTO.
   */
  @MessagePattern(ImageMessagePattern.UPDATE_IMAGE_INFORMATION)
  public updateImageInformation(@Body() imageInformationDto: ImageInformationDto): Promise<ImageInformationAmqpDto> {
    return this.imagesService.updateImageInformation(imageInformationDto);
  }

  /**
   * Removes an image and its metadata entry via AMQP.
   * @param uuid Image identifier.
   * @returns Result of the delete operation.
   */
  @MessagePattern(ImageMessagePattern.REMOVE_IMAGE)
  public removeImage(@Payload() uuid: string): Promise<boolean> {
    return this.imagesService.removeImage(uuid);
  }

  /**
   * Triggers analysis for an entire image bundle through AMQP.
   * @param uuid Identifier of an image within the bundle.
   * @returns True if the analysis workflow was stared.
   */
  @MessagePattern(ImageMessagePattern.ANALYZE_BUNDLE)
  public analyzeImageBundle(@Payload() uuid: string): Promise<boolean> {
    return this.imagesService.analyzeImageBundle(uuid);
  }

  /**
   * Saves analysis results received via AMQP and updates image metadata.
   * @param analysisResultAmqpDto Analysis result payload.
   * @returns Updated metadata as AMQP DTO.
   */
  @MessagePattern(ImageMessagePattern.PUBLISH_ANALYSIS)
  public saveAnalysisResult(@Body() analysisResultAmqpDto: AnalysisResultAmqpDto): Promise<ImageInformationAmqpDto> {
    this.logger.log('Save analysis result');
    return this.imagesService.saveAnalysisResult(analysisResultAmqpDto);
  }
}
