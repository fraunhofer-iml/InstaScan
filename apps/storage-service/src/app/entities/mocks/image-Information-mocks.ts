/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ImageInformation } from '../image.Information';

export const ImageInformationMocks: ImageInformation[] = [new ImageInformation(
  'testUuid',
  'testUrl',
  new Date('2025-04-03T06:24:59.535Z'),
  new Date('2025-04-03T06:24:59.535Z'),
  'FINISHED',
  'CMR',
    "{\"sender_information\":{\"senderNameCompany\":\"testSender\"},\"consignee_information\":{\"consigneeNameCompany\":\"testReceiver\"}}"
),
new ImageInformation(
    'testUuid',
    'testUrl',
    new Date('2025-04-03T06:24:59.535Z'),
    new Date('2025-04-03T06:24:59.535Z'),
    'FAILED',
    'CMR',
    "{\"status\": \"error\",\"message\": \"An error occurred while processing the image.\",\"error_details\": \"Connection error.\"}"
)];
