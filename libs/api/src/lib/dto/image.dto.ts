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

export class ImageDto {

  @ApiProperty()
  @IsNotEmpty()
  image_base64: string;

  @ApiProperty({
    type: String,
    enum: DocumentUploadType
  })
  documentUploadType: DocumentUploadType;

  constructor(image_base64: string, documentUploadType: DocumentUploadType) {
    this.image_base64 = image_base64;
    this.documentUploadType = documentUploadType ? documentUploadType : DocumentUploadType.JPEG;
  }
}
