/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, Inject } from '@nestjs/common';
import { AmqpBrokerQueues, ImageMessagePattern, UploadImageAmqpDto } from '@ap4/amqp';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { v4 as uuidGenerator } from 'uuid';
import { ImageDto, ImageInformationDto } from '@ap4/api';

@Injectable()
export class ImagesService {

  constructor(
    @Inject(AmqpBrokerQueues.SKALA_AP4_STORAGE_SERVICE_QUEUE)
    private readonly storageServiceAMQPClient: ClientProxy,
    @Inject(AmqpBrokerQueues.SKALA_AP4_DAS_QUEUE)
    private readonly analysisServiceAMQPClient: ClientProxy,
  ) {}

  public getImage(uuid: string): Observable<ImageDto> {
    return this.storageServiceAMQPClient.send(ImageMessagePattern.GET_BY_ID, uuid);
  }

  public getImageInformation(uuid: string): Observable<ImageInformationDto> {
    return this.storageServiceAMQPClient.send(ImageMessagePattern.READ_ANALYSIS, uuid);
  }

  public getAllImageInformation(): Observable<ImageInformationDto[]>{
    return this.storageServiceAMQPClient.send(ImageMessagePattern.GET, []);
  }

  public uploadImage(createImageDto: ImageDto): Observable<ImageInformationDto> {
    const newUuid: string = uuidGenerator();
    this.analysisServiceAMQPClient.emit(ImageMessagePattern.CREATE, new UploadImageAmqpDto(newUuid, createImageDto.image_base64));
    return this.storageServiceAMQPClient.send(ImageMessagePattern.CREATE, new UploadImageAmqpDto(newUuid, createImageDto.image_base64));
  }

  public updateImageInformation(uuid: string, imageInformationDto: ImageInformationDto): Observable<ImageInformationDto> {
    imageInformationDto.uuid = uuid;
    return this.storageServiceAMQPClient.send(ImageMessagePattern.UPDATE, imageInformationDto);
  }

  public removeImageInformation(uuid: string): Observable<boolean> {
    return this.storageServiceAMQPClient.send(ImageMessagePattern.REMOVE, uuid);
  }

}
