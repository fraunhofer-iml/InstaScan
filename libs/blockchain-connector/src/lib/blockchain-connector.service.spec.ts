/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import {AdditionalDataDto, BlockchainConnectorService} from '@ap4/blockchain-connector';
import {
  DataIntegrityService,
  TokenMintService, TokenReadDto,
  TokenReadService,
  TokenUpdateService
} from "nft-folder-blockchain-connector-besu";
import {ReadImageDtoMocks, TokenReadDtoMock} from "@ap4/api";
import {ImageInformationAmqpDtoMocks} from "@ap4/amqp";
import {AnalysisStatus} from "@ap4/utils";

describe('BlockchainConnectorService', () => {
  let service: BlockchainConnectorService;
  let mockedDataIntegrityService: Partial<DataIntegrityService>;
  let mockedTokenMintService: Partial<TokenMintService>;
  let mockedTokenUpdateService: Partial<TokenUpdateService>;
  let mockedTokenReadService: Partial<TokenReadService>;

  beforeEach(async () => {
    mockedDataIntegrityService = {
      hashData() {
        return TokenReadDtoMock.asset.hash;
      },
    };

    mockedTokenMintService = {
      mintToken() {
        return Promise.resolve(TokenReadDtoMock);
      },
    };

    mockedTokenUpdateService = {
      updateToken() {
        return Promise.resolve(TokenReadDtoMock);
      },
    };

    mockedTokenReadService = {
      getToken() {
        return Promise.resolve(TokenReadDtoMock);
      },
      getTokens() {
        return Promise.resolve([TokenReadDtoMock]);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: DataIntegrityService, useValue: mockedDataIntegrityService },
        { provide: TokenMintService, useValue: mockedTokenMintService },
        { provide: TokenUpdateService, useValue: mockedTokenUpdateService },
        { provide: TokenReadService, useValue: mockedTokenReadService },
        BlockchainConnectorService,
      ],
    }).compile();

    service = module.get<BlockchainConnectorService>(BlockchainConnectorService);
  });

  it('should create new nft', async () => {
    expect(await service.mintNFT(
        ImageInformationAmqpDtoMocks[0].uuid,
        ImageInformationAmqpDtoMocks[0],
        ReadImageDtoMocks[0].image_base64,
        ImageInformationAmqpDtoMocks[0].uuid,
        ImageInformationAmqpDtoMocks[0].image_analysis_result,
        'testAnalysisResultUrl',
    )).toEqual(TokenReadDtoMock);
  });

  it('should read nft with remote id', async () => {
    expect(await service.readNFT(ImageInformationAmqpDtoMocks[0].uuid)).toEqual(TokenReadDtoMock);
  });

  it('should update nft status', async () => {
    const updatedAdditionalData: AdditionalDataDto = JSON.parse(TokenReadDtoMock.additionalData);
    updatedAdditionalData.analysisStatus = AnalysisStatus.FINISHED;

    const updatedReadDto: TokenReadDto = TokenReadDtoMock;
    updatedReadDto.additionalData = JSON.stringify(updatedAdditionalData);

    expect(await service.updateNFTStatus(ImageInformationAmqpDtoMocks[0].uuid, AnalysisStatus.FINISHED)).toEqual(updatedReadDto);
  });

});
