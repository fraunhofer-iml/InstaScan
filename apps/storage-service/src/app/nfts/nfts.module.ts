/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockchainConnectorModule } from '@ap4/blockchain-connector';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nft } from '../entities/nft';
import { NftDatabaseService } from './nft-database.service';
import { NftsService } from './nfts.service';
import { NftBlockchainFactory } from './util/nft-blockchain-factory';
import { NftDatabaseFactory } from './util/nft-database-factory';

@Module({
  imports: [BlockchainConnectorModule, TypeOrmModule.forFeature([Nft])],
  providers: [
    NftsService,
    NftBlockchainFactory,
    NftDatabaseFactory,
    NftDatabaseService,
    {
      provide: 'NftFactory',
      useClass: process.env['BCC_ENABLED'] == 'true' ? NftBlockchainFactory : NftDatabaseFactory,
    },
  ],
  exports: [NftsService],
})
export class NftsModule {}
