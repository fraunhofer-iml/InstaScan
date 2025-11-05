/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { EcmrSchemaDto, ImageInformationDtoMocks, ReadImageDtoMocks, TokenReadDtoMock } from '@ap4/api';
import { TokenReadDto } from 'nft-folder-blockchain-connector-besu';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ImageInformationMocks } from '../entities/mocks/image-Information-mocks';
import { Nft } from '../entities/nft';
import { NftDatabaseService } from './nft-database.service';
import { NftsService } from './nfts.service';

describe('NFTDatabaseService', () => {
  let nftRepository: Repository<Nft>;
  let nftDatabaseService: NftDatabaseService;

  const mockedQueryBuilder = {
    andWhere: jest.fn(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NftDatabaseService,
        {
          provide: getRepositoryToken(Nft),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(() => mockedQueryBuilder),
          },
        },
        {
          provide: NftsService,
          useValue: {
            readNft: jest.fn(),
            updateNft: jest.fn(),
            createNft: jest.fn(),
          },
        },
      ],
    }).compile();

    nftRepository = module.get<Repository<Nft>>(getRepositoryToken(Nft));
    nftDatabaseService = module.get<NftDatabaseService>(NftDatabaseService) as NftDatabaseService;
  });

  it('mintNFT: should mint a new nft', async () => {
    ImageInformationMocks[0].image_analysis_result;
    const getImageSpy = jest.spyOn(nftRepository, 'save');
    getImageSpy.mockImplementationOnce(() => {
      return Promise.resolve(Nft.fromTokenReadDto(TokenReadDtoMock));
    });

    const emptyEcmrSchemaDto = new EcmrSchemaDto();

    const returnValue: TokenReadDto = await nftDatabaseService.mintNFT(
      TokenReadDtoMock.remoteId,
      ImageInformationMocks[0].toImageInformationAmqpDto(),
      ReadImageDtoMocks[0].image_base64,
      TokenReadDtoMock.asset.uri,
      emptyEcmrSchemaDto,
      ImageInformationMocks[0].image_analysis_result
    );
    returnValue.tokenId = 0;

    expect(returnValue).toEqual(TokenReadDtoMock);
  });

  it('readNft: should read a nft', async () => {
    ImageInformationMocks[0].image_analysis_result;
    const getImageSpy = jest.spyOn(nftRepository, 'findOne');
    getImageSpy.mockImplementationOnce(() => {
      return Promise.resolve(Nft.fromTokenReadDto(TokenReadDtoMock));
    });

    const returnValue: TokenReadDto = await nftDatabaseService.readNFT(ImageInformationDtoMocks[0].uuid);
    returnValue.tokenId = 0;

    expect(returnValue).toEqual(TokenReadDtoMock);
  });

  it('updateNFTStatus: should update a nft', async () => {
    ImageInformationMocks[0].image_analysis_result;
    const getNftSpy = jest.spyOn(nftRepository, 'findOne');
    getNftSpy.mockImplementationOnce(() => {
      return Promise.resolve(Nft.fromTokenReadDto(TokenReadDtoMock));
    });

    const saveNftSpy = jest.spyOn(nftRepository, 'save');
    saveNftSpy.mockImplementationOnce(() => {
      return Promise.resolve(Nft.fromTokenReadDto(TokenReadDtoMock));
    });

    const returnValue: TokenReadDto = await nftDatabaseService.readNFT(ImageInformationDtoMocks[0].uuid);
    returnValue.tokenId = 0;

    expect(returnValue).toEqual(TokenReadDtoMock);
  });
});
