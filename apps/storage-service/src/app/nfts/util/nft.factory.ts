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

export abstract class NftFactory {
  abstract mintNFT(
    imageUuid: string,
    imageInformation: ImageInformationAmqpDto,
    imageBase64: string,
    imageUrl: string,
    analysisResult: Schema,
    analysisResultUrl: string
  ): Promise<TokenReadDto>;
  abstract readNFT(imageUuid: string): Promise<TokenReadDto>;
  abstract updateNFTStatus(imageUuid: string, analysisStatus: AnalysisStatus): Promise<TokenReadDto>;
}
