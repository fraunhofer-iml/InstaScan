/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProperty } from '@nestjs/swagger';
import { AnalysisStatus, DocumentTypeId, DocumentUploadType } from '@ap4/utils';
import { Schema } from '../schema/schema.dto';

/**
 * This dto is used to return the image information entries from the database.
 * It is also used to show updated or newly crated entries.
 */
export class ImageInformationDto {
  @ApiProperty()
  uuid: string;
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
    enum: DocumentUploadType
  })
  documentUploadType: string;
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
  bundleId: string;
  @ApiProperty()
  image_analysis_result: Schema;

  constructor(uuid: string, sender: string, receiver: string, creationDate: Date, lastModified: Date, documentUploadType: string, analysisStatus: string, documentType: string, bundleId: string, image_analysis_result: Schema) {
    this.uuid = uuid;
    this.sender = sender;
    this.receiver = receiver;
    this.creationDate = creationDate;
    this.lastModified = lastModified;
    this.documentUploadType = documentUploadType;
    this.analysisStatus = analysisStatus;
    this.documentType = documentType;
    this.bundleId = bundleId;
    this.image_analysis_result = image_analysis_result;
  }
}
