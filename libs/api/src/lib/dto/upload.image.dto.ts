/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { DocumentUploadType } from '@ap4/utils';
import { DefaultBundleId } from '@ap4/utils';

/**
 * This dto is used to send a new image as a base64 string to the bff.
 * It is then passed on by the bff to the storage service.
 */
export class UploadImageDto {

  @ApiProperty()
  @IsNotEmpty()
  image_base64: string;

  @ApiProperty()
  bundleId: string;

  @ApiProperty({ type: String, enum: DocumentUploadType})
  documentUploadType: string;

  constructor(imageBase64: string, bundleId: string, documentUploadType: string) {
    this.image_base64 = imageBase64;
    this.bundleId = bundleId ? bundleId : DefaultBundleId;
    this.documentUploadType = documentUploadType ? documentUploadType : DocumentUploadType.JPEG;
  }
}
