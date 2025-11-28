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

  /**
   * Create a new NFT by delegating the operation to the NftDatabaseService.
   * @param imageUuid The unique UUID of the image.
   * @param imageInformation Metadata of the image (analysis status, document type).
   * @param imageBase64 The image encoded as a Base64 string.
   * @param imageUrl The URL where the image is stored.
   * @param analysisResult The analysis result as a schema object.
   * @param analysisResultUrl The URL where the analysis result is stored.
   */
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

  /**
   * Retrieve an NFT by its image UUID by delegating the operation to the NftDatabaseService.
   * @param imageUuid The UUID of the image associated with the NFT.
   */
  public async readNFT(imageUuid: string): Promise<TokenReadDto> {
    return this.nftDatabaseService.readNFT(imageUuid);
  }

  /**
   * Update the analysis status of an existing NFT by delegating the operation to the NftDatabaseService.
   * @param imageUuid The UUID of the image whose NFT should be updated.
   * @param analysisStatus The new analysis status to set.
   */
  public async updateNFTStatus(imageUuid: string, analysisStatus: AnalysisStatus): Promise<TokenReadDto> {
    return this.nftDatabaseService.updateNFTStatus(imageUuid, analysisStatus);
  }
}
