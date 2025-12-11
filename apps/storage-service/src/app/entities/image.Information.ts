/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ImageInformationAmqpDto } from '@ap4/amqp';
import { ImageInformationDto } from '@ap4/api';
import { AnalysisStatus, DocumentTypeId, DocumentUploadType } from '@ap4/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

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
    image_analysis_result: string
  ) {
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

  /**
   * Converts the ImageInformation entity into a transport-ready DTO
   * for HTTP APIs or internal services.
   * @returns A DTO containing the normalized image metadata.
   */
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
      JSON.parse(this.image_analysis_result)
    );
  }
  
  /**
   * Converts the ImageInformation entity into an AMQP-optimized DTO
   * used for message-broker communication.
   * @returns DTO formatted for event/message transport.
   */
  public toImageInformationAmqpDto(): ImageInformationAmqpDto {
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
