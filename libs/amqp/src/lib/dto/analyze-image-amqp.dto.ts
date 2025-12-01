/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { DocumentUploadType } from "@ap4/utils";

/**
 * This dto is used to send an image, that should be analyzed to the DAS.
 */
export class AnalyzeImageAmqpDto {

  uuid: string;
  image_base64: string;
  bundleId: string;
  document_type: string;

  constructor(uuid: string, image_base64: string, bundleId: string, document_type: string) {
    this.uuid = uuid;
    this.image_base64 = image_base64;
    this.bundleId = bundleId;
    this.document_type = document_type;
  }
}
