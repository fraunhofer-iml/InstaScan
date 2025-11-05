/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ImageInformationFilterAmqpDto } from '@ap4/amqp';
import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageInformation } from '../entities/image.Information';

@Injectable()
export class ImageInformationDatabaseService {
  private readonly logger: Logger = new Logger(ImageInformationDatabaseService.name);

  constructor(
    @InjectRepository(ImageInformation)
    readonly imageInformationRepository: Repository<ImageInformation>
  ) {}

  /**
   * Saves a new image information or updates an existing image information entry.
   * @param imageInformation The image information that should be stored or updated.
   */
  public async saveImageInformation(imageInformation: ImageInformation): Promise<ImageInformation> {
    this.logger.log('Save new image with uuid ', imageInformation.uuid, ' to database');
    return this.imageInformationRepository.save(imageInformation);
  }

  /**
   * Return a certain image information entry.
   * @param uuid The uuid of the image information entry that should be returned.
   */
  public async getImageInformation(uuid: string): Promise<ImageInformation> {
    return this.imageInformationRepository.findOne({
      where: { uuid: uuid },
    });
  }

  /**
   * Return the list of image information and filter it with the given filter attributes.
   * @param imageInformationFilterAmqpDto The filter attributes, that should be applied to the list of image information
   */
  public async getAllImageInformation(imageInformationFilterAmqpDto: ImageInformationFilterAmqpDto): Promise<ImageInformation[]> {
    const filterQuery = this.imageInformationRepository.createQueryBuilder('imageInformation');
    if (imageInformationFilterAmqpDto.sender) {
      filterQuery.andWhere('imageInformation.sender = :sender', { sender: imageInformationFilterAmqpDto.sender });
    }
    if (imageInformationFilterAmqpDto.receiver) {
      filterQuery.andWhere('imageInformation.receiver = :receiver', { receiver: imageInformationFilterAmqpDto.receiver });
    }
    if (imageInformationFilterAmqpDto.analysisStatus) {
      filterQuery.andWhere('imageInformation.analysisStatus = :analysisStatus', {
        analysisStatus: imageInformationFilterAmqpDto.analysisStatus,
      });
    }
    if (imageInformationFilterAmqpDto.documentType) {
      filterQuery.andWhere('imageInformation.documentType = :documentType', { documentType: imageInformationFilterAmqpDto.documentType });
    }
    if (imageInformationFilterAmqpDto.bundleId) {
      filterQuery.andWhere('imageInformation.bundleId = :bundleId', { bundleId: imageInformationFilterAmqpDto.bundleId });
    }
    return filterQuery.getMany();
  }

  /**
   * Remove an image information entry from the database.
   * @param imageInformation The image information object, that should be removed.
   */
  public async removeImageInformation(imageInformation: ImageInformation): Promise<ImageInformation[]> {
    this.logger.log('Remove image with uuid ', imageInformation.uuid, ' from database');
    return this.imageInformationRepository.remove([imageInformation]);
  }
}
