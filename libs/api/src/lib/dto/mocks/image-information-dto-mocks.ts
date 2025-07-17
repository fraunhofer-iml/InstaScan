/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ImageInformationDto } from '../image.information.dto';
import { AnalysisStatus, DocumentTypeId } from '@ap4/utils';

export const ImageInformationDtoMocks: ImageInformationDto[] = [
  new ImageInformationDto(
      'testUuid',
      'testUrl',
      'testSender',
      'testReceiver',
      new Date('2025-04-03T06:24:59.535Z'),
      new Date('2025-04-03T06:24:59.535Z'),
      AnalysisStatus.IN_PROGRESS,
      DocumentTypeId.CMR,
      JSON.parse("{\"sender_information\":{\"senderNameCompany\":\"testSender\"},\"consignee_information\":{\"consigneeNameCompany\":\"testReceiver\"}}"))
];
