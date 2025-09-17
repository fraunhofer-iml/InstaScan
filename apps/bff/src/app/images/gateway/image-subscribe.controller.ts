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

  @EventPattern(ImageMessagePattern.REFRESH_ANALYSIS)
  async handleImageUpdate() {
    this.gateway.sendRefreshImageTable();
  }
}