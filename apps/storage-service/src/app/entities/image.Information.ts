/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ImageInformationDto } from '@ap4/api';
import { ImageInformationAmqpDto } from '@ap4/amqp';
import { AnalysisStatus, DocumentTypeId, DocumentUploadType } from '@ap4/utils';

@Entity()
export class ImageInformation {

  @PrimaryColumn()
  uuid: string;
  @Column()
  sender: string;
  @Column()
  receiver: string;
  @Column()
  creationDate: Date;
  @Column()
  lastModified: Date;
  @Column()
  uploadType: string;
  @Column()
  analysisStatus: string;
  @Column()
  documentType: string;
  @Column()
  bundleId: string;
  @Column()
  image_analysis_result: string;

  constructor(
      uuid: string,
      creationDate: Date,
      lastModified: Date,
      uploadType: string,
      analysisStatus: string,
      documentType: string,
      image_analysis_result: string) {
    this.uuid = uuid;
    this.sender = '';
    this.receiver = '';
    this.creationDate = creationDate;
    this.lastModified = lastModified;
    this.uploadType = uploadType;
    this.analysisStatus = analysisStatus;
    this.documentType = documentType;
    this.image_analysis_result = image_analysis_result;
  }

  public toImageInformationDto(): ImageInformationDto {
    return new ImageInformationDto(
      this.uuid,
      this.sender,
      this.receiver,
      this.creationDate,
      this.lastModified,
      this.uploadType,
      this.analysisStatus,
      this.documentType,
      this.bundleId,
      JSON.parse(this.image_analysis_result),
    );
  }
  public toImageInformationAmqpDto(): ImageInformationAmqpDto{
    return new ImageInformationAmqpDto(
      this.uuid,
      this.sender,
      this.receiver,
      this.creationDate, 
      this.lastModified,
      DocumentUploadType[this.uploadType.toUpperCase()],
      AnalysisStatus[this.analysisStatus],
      DocumentTypeId[this.documentType],
      this.bundleId,
      JSON.parse(this.image_analysis_result)
    );
  }
}
