/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {ReadImageDto} from "@ap4/api";
import {DocumentUploadType} from "@ap4/utils";

export const ReadImageDtoMocks: ReadImageDto[] = [
  new ReadImageDto('testUuid','test_image_base_64_string', DocumentUploadType.JPEG)
];
