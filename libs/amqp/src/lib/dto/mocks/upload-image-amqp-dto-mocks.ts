/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {UploadImageAmqpDto} from '../upload-image-amqp.dto';
import {DocumentUploadType} from "@ap4/utils";

export const UploadImageAmqpDtoMocks: UploadImageAmqpDto[] = [
  new UploadImageAmqpDto('testUuid', 'testImageString', DocumentUploadType.JPEG)
];
