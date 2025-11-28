/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { createHash } from 'crypto';
import { ImageInformationAmqpDto } from '@ap4/amqp';
import { Schema } from '@ap4/api';
import { AdditionalDataDto } from '@ap4/blockchain-connector';
import { AnalysisStatus } from '@ap4/utils';
import { TokenReadDto } from 'nft-folder-blockchain-connector-besu';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nft } from '../entities/nft';

@Injectable()
export class NftDatabaseService {

  constructor(
    @InjectRepository(Nft)
    readonly nftRepository: Repository<Nft>
  ) {}

  /**
   * Create a new NFT and store it in the database.
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
    const analysisResultHash: string = this.hashData(JSON.stringify(analysisResult));
    const imageHash: string = this.hashData(imageBase64);

    const newToken: Nft = new Nft(
      imageUuid,
      imageUrl,
      imageHash,
      analysisResultUrl,
      analysisResultHash,
      JSON.stringify(new AdditionalDataDto(imageInformation.analysisStatus, imageInformation.documentType))
    );

    return (await this.nftRepository.save(newToken)).toTokenReadDto();
  }

  /**
   * Compute an SHA-256 hash for the given input string.
   * @param hashInput The input string to be hashed.
   */
  private hashData(hashInput: string): string {
    return createHash('sha256').update(hashInput).digest('hex');
  }

  /**
   * Retrieve an NFT entity from the database by its image UUID.
   * @param imageUuid The UUID of the image associated with the NFT.
   */
  private async readNFTEntity(imageUuid: string): Promise<Nft> {
    return this.nftRepository.findOne({
      where: { remoteId: imageUuid },
    });
  }

  /**
   * Retrieve an NFT from the database and return it as a DTO.
   * @param imageUuid The UUID of the image associated with the NFT.
   */
  public async readNFT(imageUuid: string): Promise<TokenReadDto> {
    const foundToken: Nft = await this.readNFTEntity(imageUuid);
    return foundToken ? foundToken.toTokenReadDto() : null;
  }

  /**
   * Update the analysis status of an existing NFT.
   * @param imageUuid The UUID of the image whose NFT should be updated.
   * @param analysisStatus The new analysis status to set.
   */
  public async updateNFTStatus(imageUuid: string, analysisStatus: AnalysisStatus): Promise<TokenReadDto> {
    const foundToken: Nft = await this.readNFTEntity(imageUuid);

    const additionalData: AdditionalDataDto = JSON.parse(foundToken.additionalData);
    additionalData.analysisStatus = analysisStatus;
    foundToken.additionalData = JSON.stringify(additionalData);

    const updatedToken: Nft = await this.nftRepository.save(foundToken);
    return updatedToken ? updatedToken.toTokenReadDto() : null;
  }
}
