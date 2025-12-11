/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */
import { DocumentUploadType, DefaultBundleId } from '@ap4/utils';

export class UploadImage {

  image_base64: string;
  bundleId: string;
  documentUploadType: string;
  documentType: string;

  constructor(imageBase64: string, bundleId: string, documentUploadType: string, documentType: string) {
    this.image_base64 = imageBase64;
    this.bundleId = bundleId || DefaultBundleId;
    this.documentUploadType = documentUploadType || DocumentUploadType.JPEG;
    this.documentType = documentType;
  }
}