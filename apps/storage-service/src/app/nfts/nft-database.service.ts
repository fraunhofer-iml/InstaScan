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
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nft } from '../entities/nft';

@Injectable()
export class NftDatabaseService {
  private readonly logger: Logger = new Logger(NftDatabaseService.name);

  constructor(
    @InjectRepository(Nft)
    readonly nftRepository: Repository<Nft>
  ) {}

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

  private hashData(hashInput: string): string {
    return createHash('sha256').update(hashInput).digest('hex');
  }

  private async readNFTEntity(imageUuid: string): Promise<Nft> {
    return this.nftRepository.findOne({
      where: { remoteId: imageUuid },
    });
  }

  public async readNFT(imageUuid: string): Promise<TokenReadDto> {
    const foundToken: Nft = await this.readNFTEntity(imageUuid);
    return foundToken ? foundToken.toTokenReadDto() : null;
  }

  public async updateNFTStatus(imageUuid: string, analysisStatus: AnalysisStatus): Promise<TokenReadDto> {
    const foundToken: Nft = await this.readNFTEntity(imageUuid);

    const additionalData: AdditionalDataDto = JSON.parse(foundToken.additionalData);
    additionalData.analysisStatus = analysisStatus;
    foundToken.additionalData = JSON.stringify(additionalData);

    const updatedToken: Nft = await this.nftRepository.save(foundToken);
    return updatedToken ? updatedToken.toTokenReadDto() : null;
  }
}
