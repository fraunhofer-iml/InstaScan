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
  'IN_PROGRESS',
  'CMR',
  "{\"status\":\"success\",\"message\":\"message\",\"error_details\":\"error_details\"}"
)];
