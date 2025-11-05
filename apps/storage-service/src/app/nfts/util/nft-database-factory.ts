/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ImageInformationAmqpDto } from '@ap4/amqp';
import { Schema } from '@ap4/api';
import { AnalysisStatus } from '@ap4/utils';
import { TokenReadDto } from 'nft-folder-blockchain-connector-besu';
import { Injectable } from '@nestjs/common';
import { NftDatabaseService } from '../nft-database.service';
import { NftFactory } from './nft.factory';

@Injectable()
export class NftDatabaseFactory extends NftFactory {
  constructor(private readonly nftDatabaseService: NftDatabaseService) {
    super();
  }

  public async mintNFT(
    imageUuid: string,
    imageInformation: ImageInformationAmqpDto,
    imageBase64: string,
    imageUrl: string,
    analysisResult: Schema,
    analysisResultUrl: string
  ): Promise<TokenReadDto> {
    return this.nftDatabaseService.mintNFT(imageUuid, imageInformation, imageBase64, imageUrl, analysisResult, analysisResultUrl);
  }

  public async readNFT(imageUuid: string): Promise<TokenReadDto> {
    return this.nftDatabaseService.readNFT(imageUuid);
  }

  public async updateNFTStatus(imageUuid: string, analysisStatus: AnalysisStatus): Promise<TokenReadDto> {
    return this.nftDatabaseService.updateNFTStatus(imageUuid, analysisStatus);
  }
}
