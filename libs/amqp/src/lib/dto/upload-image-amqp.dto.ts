/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { DocumentUploadType } from "@ap4/utils";

export class UploadImageAmqpDto {

  uuid: string;
  image_base64: string;
  uploadType: DocumentUploadType;

  constructor(uuid: string, image_base64: string, uploadType: DocumentUploadType) {
    this.uuid = uuid;
    this.image_base64 = image_base64;
    this.uploadType = uploadType;
  }
}
