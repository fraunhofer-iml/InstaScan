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

  public readNft(uuid: string): Promise<TokenReadDto> {
    return this.nftService.readNFT(uuid);
  }

  public async updateNft(updatedImageInformation: ImageInformationAmqpDto): Promise<TokenReadDto> {
    if (await this.readNft(updatedImageInformation.uuid)) {
      return this.nftService.updateNFTStatus(updatedImageInformation.uuid, updatedImageInformation.analysisStatus);
    }
  }
}
