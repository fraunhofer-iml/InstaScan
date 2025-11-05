/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Module } from '@nestjs/common';
import { BlockchainConnectorService } from './blockchain-connector.service';
import {DataIntegrityModule, TokenModule} from "nft-folder-blockchain-connector-besu";

@Module({
  imports: [DataIntegrityModule, TokenModule],
  providers: [BlockchainConnectorService],
  exports: [BlockchainConnectorService, DataIntegrityModule, TokenModule]
})
export class BlockchainConnectorModule {}
