/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisStatus, DocumentTypeId, DocumentUploadType } from '@ap4/utils';
import { Schema } from '@ap4/api';
export class ImageInformationAmqpDto {

  uuid: string;
  sender: string;
  receiver: string;
  creationDate: Date;
  lastModified: Date;
  uploadType: DocumentUploadType;
  analysisStatus: AnalysisStatus;
  documentType: DocumentTypeId;
  image_analysis_result: Schema;

  constructor(uuid: string, sender: string, receiver: string, creationDate: Date, lastModified: Date, uploadType: DocumentUploadType, analysisStatus: AnalysisStatus, documentType: DocumentTypeId, image_analysis_result: Schema) {
    this.uuid = uuid;
    this.sender = sender;
    this.receiver = receiver;
    this.creationDate = creationDate;
    this.lastModified = lastModified;
    this.uploadType = uploadType;
    this.analysisStatus = analysisStatus;
    this.documentType = documentType;
    this.image_analysis_result = image_analysis_result;
  }
}
