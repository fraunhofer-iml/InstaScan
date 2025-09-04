/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {DocumentUploadType} from "@ap4/utils";

/**
 * This dto is used to return a stored image as base64 string.
 * It also contains the uuid and the bundleId that is associated with the image.
 */
export class ReadImageDto {

  uuid: string;
  image_base64: string;
  documentUploadType: DocumentUploadType;

  constructor(uuid: string, imageBase64: string, documentUploadType: DocumentUploadType) {
    this.uuid = uuid;
    this.image_base64 = imageBase64;
    this.documentUploadType = documentUploadType;
  }
}
