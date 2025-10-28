/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {UploadImageDto} from "../upload.image.dto";
import { DocumentTypeId, DocumentUploadType} from "@ap4/utils";

export const UploadImageDtoMocks: UploadImageDto[] = [
  new UploadImageDto('test_image_base_64_string', 'testBundleId', DocumentUploadType.JPEG, DocumentTypeId.CMR)
];
