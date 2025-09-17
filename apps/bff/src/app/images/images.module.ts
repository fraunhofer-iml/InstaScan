/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { AmqpBroker } from '@ap4/amqp';
import { ImageSubscribeController } from './gateway/image-subscribe.controller';
import { ImageGateway } from './gateway/image.gateway';

@Module({
  controllers: [ImagesController, ImageSubscribeController],
  providers: [ImagesService, ImageGateway],
  imports: [
    new AmqpBroker().getStorageServiceBroker()
  ]
})
export class ImagesModule {}
