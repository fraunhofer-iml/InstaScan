/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {Inject, Injectable, Logger} from '@nestjs/common';
import {AmqpBrokerQueues, ImageMessagePattern, AnalyzeImageAmqpDto} from '@ap4/amqp';
import {ClientProxy} from "@nestjs/microservices";

@Injectable()
export class AmqpBrokerService {

  private readonly logger = new Logger(AmqpBrokerService.name);

  constructor(
    @Inject(AmqpBrokerQueues.SKALA_AP4_DAS_QUEUE)
    private readonly analysisServiceAMQPClient: ClientProxy
  ) {}

  /**
   * Sends a picture to the DAS to analyze it.
   * @param uuid The uuid of the picture, that should be analyzed.
   * @param imageBase64 The image as base64 string, that should be analyzed.
   * @param bundleId The id of the bundle to which the image belongs.
   * @param documentUploadType The type of the document of the new image.
   */
  public sendImageToAnalysisService(uuid: string, imageBase64: string, bundleId: string, documentUploadType: string){
    this.analysisServiceAMQPClient.emit(ImageMessagePattern.UPLOAD_NEW_IMAGE, new AnalyzeImageAmqpDto(uuid, imageBase64, bundleId, documentUploadType));
  }
}
