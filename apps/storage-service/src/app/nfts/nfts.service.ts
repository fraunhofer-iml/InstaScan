/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResultAmqpDto, ImageInformationAmqpDto } from '@ap4/amqp';
import { ReadImageDto } from '@ap4/api';
import { TokenReadDto } from 'nft-folder-blockchain-connector-besu';
import { Inject, Injectable } from '@nestjs/common';
import { NftFactory } from './util/nft.factory';

@Injectable()
export class NftsService {
  constructor(
    @Inject('NftFactory')
    private readonly nftService: NftFactory
  ) {}

  /**
   * Create a new NFT by delegating the minting process to the underlying NftService.
   * @param analysisResultAmqpDto The analysis result data including the image UUID and analysis schema.
   * @param imageInformationAmqpDto Metadata of the image.
   * @param storedImage The stored image data including Base64 content and UUID.
   */
  public createNft(
    analysisResultAmqpDto: AnalysisResultAmqpDto,
    imageInformationAmqpDto: ImageInformationAmqpDto,
    storedImage: ReadImageDto
  ): Promise<TokenReadDto> {
    return this.nftService.mintNFT(
      analysisResultAmqpDto.uuid,
      imageInformationAmqpDto,
      storedImage.image_base64,
      storedImage.uuid,
      analysisResultAmqpDto.image_analysis_result,
      imageInformationAmqpDto.uuid
    );
  }

  /**
   * Retrieve an NFT by its UUID by delegating the operation to the NftService.
   * @param uuid The UUID of the image associated with the NFT.
   */
  public readNft(uuid: string): Promise<TokenReadDto> {
    return this.nftService.readNFT(uuid);
  }

  /**
   * Update the analysis status of an existing NFT.
   * @param updatedImageInformation The updated image metadata containing the UUID and analysis status.
   */
  public async updateNft(updatedImageInformation: ImageInformationAmqpDto): Promise<TokenReadDto> {
    if (await this.readNft(updatedImageInformation.uuid)) {
      return this.nftService.updateNFTStatus(updatedImageInformation.uuid, updatedImageInformation.analysisStatus);
    }
  }
}
