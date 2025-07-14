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
import { AnalysisStatus, DocumentTypeId } from '@ap4/utils';

@Entity()
export class ImageInformation {

  @PrimaryColumn()
  uuid: string;

  @Column()
  url: string;

  @Column()
  creationDate: Date

  @Column()
  lastModified: Date

  @Column()
  analysisStatus: string

  @Column()
  documentType: string

  @Column()
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

  public toImageInformationDto(): ImageInformationDto {
    return new ImageInformationDto(
      this.uuid,
      this.url,
      this.creationDate,
      this.lastModified,
      this.analysisStatus,
      this.documentType,
      JSON.parse(this.image_analysis_result),
    );
  }
  public toImageInformationAmqpDto(): ImageInformationAmqpDto{
    return new ImageInformationAmqpDto(
      this.uuid, 
      this.url, 
      this.creationDate, 
      this.lastModified, 
      AnalysisStatus[this.analysisStatus],
      DocumentTypeId[this.documentType],
      JSON.parse(this.image_analysis_result)
    );
  }
}
