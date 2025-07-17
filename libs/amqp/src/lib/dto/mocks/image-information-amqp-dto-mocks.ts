/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisStatus, DocumentTypeId } from '@ap4/utils';
import { ImageInformationAmqpDto } from '../image-information-amqp.dto';
import { ErrorSchemaDto } from '@ap4/api';

export const ImageInformationAmqpDtoMocks: ImageInformationAmqpDto[] = [new ImageInformationAmqpDto(
  'testUuid',
  'testUrl',
  'testSender',
  'testReceiver',
  new Date(),
  new Date(),
  AnalysisStatus.IN_PROGRESS,
  DocumentTypeId.CMR,
  new ErrorSchemaDto('error', 'message', 'error_details')
)];
