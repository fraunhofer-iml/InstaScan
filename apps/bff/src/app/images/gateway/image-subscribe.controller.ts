/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ImageGateway } from "./image.gateway";
import { EventPattern } from "@nestjs/microservices";
import { ImageMessagePattern } from '@ap4/amqp';
import { Controller } from "@nestjs/common";
@Controller()
export class ImageSubscribeController {
  constructor(private readonly gateway: ImageGateway) {}

  /**
   * Handles incoming REFRESH_ANALYSIS events from the message broker.
   * 
   * Triggered when updated image-analysis results are published.
   * Executes internal refresh logic without blocking the event loop.
   */
  @EventPattern(ImageMessagePattern.REFRESH_ANALYSIS)
  async handleImageUpdate() {
    await this.gateway.sendRefreshImageTable();
  }
}