/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { TokenAssetDto, TokenHierarchyDto, TokenMetadataDto, TokenReadDto } from 'nft-folder-blockchain-connector-besu';
import {AdditionalDataDto} from "@ap4/blockchain-connector";
import {AnalysisStatus, DocumentTypeId} from "@ap4/utils";

export const TokenUpdateDtoMock: TokenReadDto = new TokenReadDto(
    '11877e04-ca7b-41eb-9022-d4deaead0fda',
    new TokenAssetDto('11877e04-ca7b-41eb-9022-d4deaead0fda.jpeg', 'b28c94b2195c8ed259f0b415aaee3f39b0b2920a4537611499fa044956917a21'),
    new TokenMetadataDto('11877e04-ca7b-41eb-9022-d4deaead0fda.json', 'dfb95c68429c22041014e3eb9da9d74bf72ce08d96123861b2d6263074ceac65'),
    JSON.stringify(new AdditionalDataDto(AnalysisStatus.FINISHED, DocumentTypeId.CMR)),
    new TokenHierarchyDto(false, [], []),
    '0x72e37d393c70823113a7176aC1F7C579d2C5623E',
    '0x72e37d393c70823113a7176aC1F7C579d2C5623E',
    '2024-10-12T00:00:00.000Z',
    '2024-11-12T00:00:00.000Z',
    0,
    '0x2B2f78c5BF6D9C12Ee1225D5F374aa91204580c3'
);
