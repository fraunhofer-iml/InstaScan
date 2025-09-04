/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * This dto is used to contain the filter attributes, that are used to filter the list of image information entries.
 */
export class ImageInformationFilterAmqpDto {

  sender?: string;
  receiver?: string;
  analysisStatus?: string;
  documentType?: string;
  bundleId?: string;

  constructor(sender: string, receiver: string, analysisStatus: string, documentType: string, bundleId: string) {
    this.sender = sender;
    this.receiver = receiver;
    this.analysisStatus = analysisStatus;
    this.documentType = documentType;
    this.bundleId = bundleId;
  }
}
