/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisStatus, DocumentTypeId, DocumentUploadType } from '@ap4/utils';
import { ImageInformationAmqpDto } from '../image-information-amqp.dto';
import { ErrorSchemaDto } from '@ap4/api';

export const ImageInformationAmqpDtoMocks: ImageInformationAmqpDto[] = [new ImageInformationAmqpDto(
  'testUuid',
  'testSender',
  'testReceiver',
  new Date(),
  new Date(),
  DocumentUploadType.JPEG,
  AnalysisStatus.IN_PROGRESS,
  DocumentTypeId.CMR,
  'testId',
  new ErrorSchemaDto('error', 'message', 'error_details')
)];
