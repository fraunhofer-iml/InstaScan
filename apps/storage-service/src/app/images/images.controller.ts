/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Body, Controller, Logger } from '@nestjs/common';
import { ImagesService } from './images.service';
import {
  ImageMessagePattern,
  AnalysisResultAmqpDto,
  ImageInformationAmqpDto,
  UploadImageAmqpDto
} from '@ap4/amqp';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ImageDto, ImageInformationDto } from '@ap4/api';

@Controller()
export class ImagesController {

  private readonly logger = new Logger(ImagesController.name);

  constructor(private readonly imagesService: ImagesService) {
  }

  @MessagePattern(ImageMessagePattern.GET_BY_ID)
  public getImage(@Payload() uuid: string): Promise<ImageDto> {
    return this.imagesService.getImage(uuid);
  }

  @MessagePattern(ImageMessagePattern.READ_ANALYSIS)
  public getImageInformation(@Payload() uuid: string): Promise<ImageInformationDto> {
    return this.imagesService.getImageInformation(uuid);
  }

  @MessagePattern(ImageMessagePattern.GET)
  public getAllImageInformation(): Promise<ImageInformationDto[]> {
    return this.imagesService.getAllImageInformation();
  }

  @MessagePattern(ImageMessagePattern.CREATE)
  public uploadImage(@Body() body: UploadImageAmqpDto): Promise<ImageInformationDto> {
    return this.imagesService.uploadImage(body);
  }

  @MessagePattern(ImageMessagePattern.PUBLISH_ANALYSIS)
  public saveAnalysisResult(@Body() analysisResultAmqpDto: AnalysisResultAmqpDto): Promise<ImageInformationAmqpDto> {
    this.logger.log("Save analysis result");
    return this.imagesService.saveAnalysisResult(analysisResultAmqpDto);
  }

  @MessagePattern(ImageMessagePattern.UPDATE)
  public updateImageInformation(@Body() imageInformationDto: ImageInformationDto): Promise<ImageInformationDto> {
    return this.imagesService.updateImageInformation(imageInformationDto);
  }
}
