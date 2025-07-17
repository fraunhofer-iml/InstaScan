/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProperty } from '@nestjs/swagger';
import { AnalysisStatus, DocumentTypeId } from '@ap4/utils';
import { Schema } from '../schema/schema.dto';

export class ImageInformationDto {
  @ApiProperty()
  uuid: string;
  @ApiProperty()
  url: string;
  @ApiProperty()
  sender: string;
  @ApiProperty()
  receiver: string;
  @ApiProperty()
  creationDate: Date;
  @ApiProperty()
  lastModified: Date;
  @ApiProperty({
    type: String,
    enum: AnalysisStatus,
  })
  analysisStatus: string;
  @ApiProperty({
    type: String,
    enum: DocumentTypeId,
  })
  documentType: string;
  @ApiProperty()
  image_analysis_result: Schema;

  constructor(uuid: string, url: string, sender: string, receiver: string, creationDate: Date, lastModified: Date, analysisStatus: string, documentType: string, image_analysis_result: Schema) {
    this.uuid = uuid;
    this.url = url;
    this.sender = sender;
    this.receiver = receiver;
    this.creationDate = creationDate;
    this.lastModified = lastModified;
    this.analysisStatus = analysisStatus;
    this.documentType = documentType;
    this.image_analysis_result = image_analysis_result;
  }
}
