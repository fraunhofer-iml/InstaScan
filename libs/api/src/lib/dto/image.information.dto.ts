/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProperty } from '@nestjs/swagger';
import { AnalysisStatus, DocumentTypeId } from '@ap4/utils';

export class ImageInformationDto {
  @ApiProperty()
  uuid: string;
  @ApiProperty()
  url: string;
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
  image_analysis_result: string;

  constructor(uuid: string, url: string, creationDate: Date, lastModified: Date, analysisStatus: string, documentType: string, image_analysis_result: string) {
    this.uuid = uuid;
    this.url = url;
    this.creationDate = creationDate;
    this.lastModified = lastModified;
    this.analysisStatus = analysisStatus;
    this.documentType = documentType;
    this.image_analysis_result = image_analysis_result;
  }
}
