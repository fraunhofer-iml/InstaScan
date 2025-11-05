/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {AnalysisStatus, DocumentTypeId} from "@ap4/utils";

export class AdditionalDataDto {
  analysisStatus: AnalysisStatus;
  documentType: DocumentTypeId;

  constructor(analysisStatus: AnalysisStatus, documentType: DocumentTypeId) {
    this.analysisStatus = analysisStatus;
    this.documentType = documentType;
  }
}
