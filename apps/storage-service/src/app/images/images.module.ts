/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import * as process from 'node:process';
import { AmqpBroker } from '@ap4/amqp';
import { MinioModule } from 'nestjs-minio-client';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageInformation } from '../entities/image.Information';
import { NftsModule } from '../nfts/nfts.module';
import { AmqpBrokerService } from './amqp.broker.service';
import { ImageInformationDatabaseService } from './image.information.database.service';
import { ImagesController } from './images.controller';
import { ImagesS3Service } from './images.s3.service';
import { ImagesService } from './images.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, ImageInformationDatabaseService, ImagesS3Service, AmqpBrokerService],
  imports: [
    NftsModule,
    new AmqpBroker().getDASBroker(),
    new AmqpBroker().getBFFBroker(),
    TypeOrmModule.forFeature([ImageInformation]),
    MinioModule.register({
      endPoint: process.env.S3_HOST ?? '',
      port: process.env.S3_PORT ? parseInt(process.env.S3_PORT) : 9000,
      useSSL: (process.env.S3_USE_SSL ?? 'false') === 'true',
      accessKey: process.env.S3_ACCESS_KEY ?? '',
      secretKey: process.env.S3_SECRET_KEY ?? '',
    }),
  ],
})
export class ImagesModule {}
