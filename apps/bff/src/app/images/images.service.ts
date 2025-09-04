/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {Injectable, Inject} from '@nestjs/common';
import {AmqpBrokerQueues, ImageInformationFilterAmqpDto, ImageMessagePattern} from '@ap4/amqp';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {ImageInformationDto, ReadImageDto, UploadImageDto} from '@ap4/api';

@Injectable()
export class ImagesService {

  constructor(
    @Inject(AmqpBrokerQueues.SKALA_AP4_STORAGE_SERVICE_QUEUE)
    private readonly storageServiceAMQPClient: ClientProxy
  ) {}

  /**
   * Returns an image from the s3 service as a base64 string.
   * @param uuid The uuid whose image is to be returned.
   */
  public getImage(uuid: string): Observable<ReadImageDto> {
    return this.storageServiceAMQPClient.send(ImageMessagePattern.GET_IMAGE, uuid);
  }

  /**
   * Return the image information entry for a specific uuid.
   * @param uuid The uuid whose image information entry is to be returned.
   */
  public getImageInformation(uuid: string): Observable<ImageInformationDto> {
    return this.storageServiceAMQPClient.send(ImageMessagePattern.GET_IMAGE_INFORMATION, uuid);
  }

  /**
   * Returns all image information entries. Optionally, a bundle id can be specified to return only image information entries with this bundle id.
   * @param sender The sender of the document
   * @param receiver The receiver of the document
   * @param analysisStatus The current analysis status of the document
   * @param documentType The type of the document
   * @param bundleId The bundle id that can be used to filter the image information.
   */
  public getAllImageInformation(sender: string, receiver: string, analysisStatus: string, documentType: string, bundleId: string): Observable<ImageInformationDto[]>{
    const imageInformationFilterAmqpDto: ImageInformationFilterAmqpDto = new ImageInformationFilterAmqpDto(sender, receiver, analysisStatus, documentType, bundleId);
    return this.storageServiceAMQPClient.send(ImageMessagePattern.GET_ALL_IMAGE_INFORMATION, imageInformationFilterAmqpDto);
  }

  /**
   * Uploads a new image, saves it to the s3 server and creates a new image information entry.
   * @param uploadImageDto The image to be uploaded as base64 string and the bundle id.
   */
  public uploadImage(uploadImageDto: UploadImageDto): Observable<ImageInformationDto> {
    return this.storageServiceAMQPClient.send(ImageMessagePattern.UPLOAD_NEW_IMAGE, uploadImageDto);
  }

  /**
   * Edit existing image information entries.
   * @param uuid The uuid whose image information is to be adjusted.
   * @param imageInformationDto The new values with which the image information entry is to be updated.
   */
  public updateImageInformation(uuid: string, imageInformationDto: ImageInformationDto): Observable<ImageInformationDto> {
    imageInformationDto.uuid = uuid;
    return this.storageServiceAMQPClient.send(ImageMessagePattern.UPDATE_IMAGE_INFORMATION, imageInformationDto);
  }

  /**
   * Remove the image and the image information with the given uuid.
   * @param uuid The uuid of the image to be removed.
   */
  public removeImage(uuid: string): Observable<boolean> {
    return this.storageServiceAMQPClient.send(ImageMessagePattern.REMOVE_IMAGE, uuid);
  }

  /**
   * Sends a bundle id to the storage service, which searches for all images stored for this bundle and sends each of these images to the DAS for analysis.
   * @param bundleId The bundle id whose images are to be analyzed.
   */
  public analyzeImageBundle(bundleId: string): Observable<boolean> {
    return this.storageServiceAMQPClient.send(ImageMessagePattern.ANALYZE_BUNDLE, bundleId);
  }
}
