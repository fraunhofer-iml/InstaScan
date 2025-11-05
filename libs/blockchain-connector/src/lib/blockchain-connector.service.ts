/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@nestjs/common';
import {
    DataIntegrityService, TokenAssetDto, TokenMetadataDto,
    TokenMintService, TokenReadDto,
    TokenReadService, TokenUpdateDto,
    TokenUpdateService
} from "nft-folder-blockchain-connector-besu";
import {ImageInformationAmqpDto} from "@ap4/amqp";
import {Schema} from "@ap4/api";
import {AdditionalDataDto} from "./additional.data.dto";
import {AnalysisStatus} from "@ap4/utils";

@Injectable()
export class BlockchainConnectorService {
    constructor(
        private readonly dataIntegrityService: DataIntegrityService,
        private readonly tokenMintService: TokenMintService,
        private readonly tokenUpdateService: TokenUpdateService,
        private readonly tokenReadService: TokenReadService
    ) {}

    public mintNFT(
        imageUuid: string,
        imageInformation: ImageInformationAmqpDto,
        imageBase64: string,
        imageUrl: string,
        analysisResult: Schema,
        analysisResultUrl: string
    ): Promise<TokenReadDto> {
        const analysisResultHash: string = this.dataIntegrityService.hashData(Buffer.from(JSON.stringify(analysisResult)));
        const imageHash: string = this.dataIntegrityService.hashData(Buffer.from(imageBase64));

        return this.tokenMintService.mintToken(
            {
                remoteId: imageUuid,
                asset: new TokenAssetDto(imageUrl, imageHash),
                metadata: new TokenMetadataDto(analysisResultUrl, analysisResultHash),
                additionalData: JSON.stringify(new AdditionalDataDto(imageInformation.analysisStatus, imageInformation.documentType)),
                parentIds: [],
            },
            false
        );
    }

    public readNFT(imageUuid: string): Promise<TokenReadDto | null> {
        return this.tokenReadService.getTokens(imageUuid).then(foundImageNfts => {
            return foundImageNfts.length>0 ? foundImageNfts[0] : null;
        })
    }

    public async updateNFTStatus(imageUuid: string, analysisStatus: AnalysisStatus): Promise<TokenReadDto | null> {
        const foundToken: TokenReadDto | null = await this.readNFT(imageUuid);
        if(!foundToken){
            return null;
        }

        const additionalData: AdditionalDataDto = JSON.parse(foundToken.additionalData);
        additionalData.analysisStatus = analysisStatus;

        const tokenUpdateDto: TokenUpdateDto = {
            assetUri: foundToken.asset.uri,
            assetHash: foundToken.asset.hash,
            metadataUri: foundToken.metadata.uri,
            metadataHash: foundToken.metadata.hash,
            additionalData: JSON.stringify(additionalData),
        };
        return this.tokenUpdateService.updateToken(foundToken.tokenId, tokenUpdateDto);
    }
}
