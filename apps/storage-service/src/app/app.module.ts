/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageInformation } from './entities/image.Information';
import { Nft } from './entities/nft';
import { ImagesModule } from './images/images.module';
import { NftsModule } from './nfts/nfts.module';

@Module({
  imports: [
    ImagesModule,
    NftsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST ?? '',
      port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
      username: process.env.POSTGRES_USERNAME ?? '',
      password: process.env.POSTGRES_PASSWORD ?? '',
      database: process.env.POSTGRES_DATABASE ?? '',
      entities: [ImageInformation, Nft],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
