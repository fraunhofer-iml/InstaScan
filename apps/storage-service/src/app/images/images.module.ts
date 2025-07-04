/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Module } from '@nestjs/common';
import {ImagesController} from "./images.controller";
import {ImagesService} from "./images.service";
import { MinioModule } from 'nestjs-minio-client';
import * as process from 'node:process';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageInformation } from '../entities/image.Information';

@Module({
    controllers: [ImagesController],
    providers: [ImagesService],
  imports:[
    TypeOrmModule.forFeature([ImageInformation]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST ?? '',
      port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
      username: process.env.POSTGRES_USERNAME ?? '',
      password: process.env.POSTGRES_PASSWORD ?? '',
      database: process.env.POSTGRES_DATABASE ?? '',
      entities: [ImageInformation],
      synchronize: true,
    }),
    MinioModule.register({
    endPoint: process.env.S3_HOST ?? '',
    port: process.env.S3_PORT? parseInt(process.env.S3_PORT) : 9000,
    useSSL: (process.env.S3_USE_SSL ?? 'false') === 'true',
    accessKey: process.env.S3_ACCESS_KEY ?? '' ,
    secretKey: process.env.S3_SECRET_KEY ?? '',
  })

  ]
})
export class ImagesModule {}
