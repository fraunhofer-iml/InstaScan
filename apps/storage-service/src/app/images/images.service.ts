/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResultAmqpDto, ImageInformationAmqpDto, ImageInformationFilterAmqpDto } from '@ap4/amqp';
import { ImageInformationDto, ReadImageDto, UploadImageDto } from '@ap4/api';
import { ANALYSIS_INITIAL_RESULT, AnalysisStatus, DocumentUploadType } from '@ap4/utils';
import { TokenReadDto } from 'nft-folder-blockchain-connector-besu';
import { v4 as uuidGenerator } from 'uuid';
import { Injectable, Logger } from '@nestjs/common';
import { ImageInformation } from '../entities/image.Information';
import { NftsService } from '../nfts/nfts.service';
import { AmqpBrokerService } from './amqp.broker.service';
import { ImageInformationDatabaseService } from './image.information.database.service';
import { ImagesS3Service } from './images.s3.service';

@Injectable()
export class ImagesService {
  private readonly logger: Logger = new Logger(ImagesService.name);

  constructor(
    readonly imageInformationDatabaseService: ImageInformationDatabaseService,
    readonly imagesS3Service: ImagesS3Service,
    readonly amqpBrokerService: AmqpBrokerService,
    readonly nftService: NftsService
  ) {}

  /**
   * Returns an image for a specific uuid. The image is specified as a base64 string within a dto.
   * @param uuid The uuid of the image, that should be returned.
   */
  public async getImage(uuid: string): Promise<ReadImageDto> {
    const foundImageInformation: ImageInformation = await this.imageInformationDatabaseService.getImageInformation(uuid);
    if (!foundImageInformation) {
      return null;
    }
    return this.imagesS3Service
      .getImage(uuid)
      .then(
        (base64Image) =>
          new ReadImageDto(foundImageInformation.uuid, base64Image, DocumentUploadType[foundImageInformation.uploadType.toUpperCase()])
      );
  }

  /**
   * Returns an image information entry fo a certain uuid.
   * @param uuid The uuid of the image information that should be returned.
   */
  public async getImageInformation(uuid: string): Promise<ImageInformationDto> {
    return this.imageInformationDatabaseService
      .getImageInformation(uuid)
      .then((foundImage) => (foundImage ? foundImage.toImageInformationDto() : null));
  }

  /**
   * Returns token information for a specific image.
   * @param uuid The uuid of the nft that should be returned.
   */
  public async getImageNft(uuid: string): Promise<TokenReadDto> {
    return this.nftService.readNft(uuid);
  }

  /**
   * Returns every image information entry. If a bundle id is specified, it only returns image information entries with that specific bundle id.
   * @param imageInformationFilterAmqpDto The attributes, that can be used to filter the list of image information.
   */
  public async getAllImageInformation(imageInformationFilterAmqpDto: ImageInformationFilterAmqpDto): Promise<ImageInformationDto[]> {
    const storedImageInformation: ImageInformation[] =
      await this.imageInformationDatabaseService.getAllImageInformation(imageInformationFilterAmqpDto);
    return storedImageInformation.map((imageInformation: ImageInformation) => imageInformation.toImageInformationDto());
  }

  /**
   * Uploads the a new image to the s3 serve and saves a new image information entry in the database.
   * It also generates a new uuid for this image and the image information.
   * @param uploadImageAmqpDto The dto that contains the image that should be uploaded as base64 string and the bundle id.
   */
  public async uploadImage(uploadImageAmqpDto: UploadImageDto): Promise<ImageInformationDto> {
    try {
      const newUuid: string = uuidGenerator();
      await this.imagesS3Service.uploadImage(uploadImageAmqpDto.image_base64, newUuid);

      const newImageInformation: ImageInformation = new ImageInformation(
        newUuid,
        new Date(),
        new Date(),
        uploadImageAmqpDto.documentUploadType,
        AnalysisStatus.PENDING,
        uploadImageAmqpDto.documentType,
        ANALYSIS_INITIAL_RESULT
      );
      newImageInformation.bundleId = uploadImageAmqpDto.bundleId;
      return this.imageInformationDatabaseService
        .saveImageInformation(newImageInformation)
        .then((result: ImageInformation) => result.toImageInformationDto());
    } catch (e) {
      this.logger.error('The image could not be saved correctly.', e);
    }
  }

  /**
   * Update a certain image information entry.
   * @param imageInformationDto The new data of the image information.
   */
  public async updateImageInformation(imageInformationDto: ImageInformationDto): Promise<ImageInformationAmqpDto> {
    try {
      const foundImage: ImageInformation = await this.imageInformationDatabaseService.getImageInformation(imageInformationDto.uuid);
      if (!foundImage) {
        return null;
      }
      foundImage.image_analysis_result = JSON.stringify(imageInformationDto.image_analysis_result);
      if ('sender_information' in imageInformationDto.image_analysis_result) {
        foundImage.sender = imageInformationDto.image_analysis_result.sender_information.senderNameCompany;
        foundImage.receiver = imageInformationDto.image_analysis_result.consignee_information.consigneeNameCompany;
      }
      foundImage.analysisStatus = imageInformationDto.analysisStatus;
      foundImage.bundleId = imageInformationDto.bundleId;
      foundImage.documentType = imageInformationDto.documentType;
      foundImage.lastModified = new Date();

      const updatedImageInformation: ImageInformationAmqpDto = await this.imageInformationDatabaseService
        .saveImageInformation(foundImage)
        .then((updatedImage) => updatedImage.toImageInformationAmqpDto());
      await this.nftService.updateNft(updatedImageInformation);
      return updatedImageInformation;
    } catch (e) {
      this.logger.error('The image could not be updated correctly.', e);
    }
  }

  /**
   * Removes an image from the database and from the s3 server.
   * @param uuid The uuid of the image, that should be removed.
   */
  public async removeImage(uuid: string): Promise<boolean> {
    const foundImageInformation: ImageInformation = await this.imageInformationDatabaseService.getImageInformation(uuid);
    if (!foundImageInformation) {
      return false;
    }

    await this.imagesS3Service.removeImage(uuid);
    await this.imageInformationDatabaseService.removeImageInformation(foundImageInformation);

    this.logger.log('Removed image with uuid ', uuid);
    return true;
  }

  /**
   * Finds every image for a specific bundle id and sends them to the DAS for the analysis.
   * @param bundleId The id of the bundle whose images are to be analyzed.
   */
  public async analyzeImageBundle(bundleId: string): Promise<boolean> {
    try {
      const foundImageInformation: ImageInformation[] = await this.imageInformationDatabaseService.getAllImageInformation({
        bundleId: bundleId,
        analysisStatus: AnalysisStatus.PENDING,
      });
      for (const imageInformation of foundImageInformation) {
        this.logger.log('Send imageInformation to DAS with uuid: ', imageInformation.uuid);
        const imageBase64: string = await this.imagesS3Service.getImage(imageInformation.uuid);
        this.amqpBrokerService.sendImageToAnalysisService(
          imageInformation.uuid,
          imageBase64,
          imageInformation.bundleId,
          imageInformation.documentType
        );
        imageInformation.analysisStatus = AnalysisStatus.IN_PROGRESS;
        await this.imageInformationDatabaseService.saveImageInformation(imageInformation);
      }
      return true;
    } catch (e) {
      this.logger.error('Not all images could be transferred to the DAS.', e);
      return false;
    }
  }

  /**
   * Receives an analysis result and updates the entry in the database.
   * @param analysisResultAmqpDto The result of the analysis, that should be stored.
   */
  public async saveAnalysisResult(analysisResultAmqpDto: AnalysisResultAmqpDto): Promise<ImageInformationAmqpDto> {
    try {
      const storedImage = await this.getImage(analysisResultAmqpDto.uuid);
      if (!storedImage) {
        return null;
      }
      const foundImageInformation: ImageInformation = await this.imageInformationDatabaseService.getImageInformation(
        analysisResultAmqpDto.uuid
      );

      if ('error_details' in analysisResultAmqpDto.image_analysis_result) {
        foundImageInformation.analysisStatus = AnalysisStatus.FAILED;
      } else {
        foundImageInformation.analysisStatus = AnalysisStatus.FINISHED;
        foundImageInformation.sender = analysisResultAmqpDto.image_analysis_result.sender_information.senderNameCompany;
        foundImageInformation.receiver = analysisResultAmqpDto.image_analysis_result.consignee_information.consigneeNameCompany;
      }
      foundImageInformation.image_analysis_result = JSON.stringify(analysisResultAmqpDto.image_analysis_result);
      this.amqpBrokerService.sendRefreshToBff();
      const updatedImageInformation = await this.imageInformationDatabaseService
        .saveImageInformation(foundImageInformation)
        .then((saveImageInformationResponse) => saveImageInformationResponse.toImageInformationAmqpDto());

      await this.nftService.createNft(analysisResultAmqpDto, updatedImageInformation, storedImage);

      return updatedImageInformation;
    } catch (e) {
      this.logger.error('The analysis result could not be saved. ', e);
      return null;
    }
  }
}
