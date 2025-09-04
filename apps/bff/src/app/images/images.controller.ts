/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  Put,
  Delete,
  Query
} from '@nestjs/common';
import { ImagesService } from './images.service';
import {ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from '@nestjs/swagger';
import { ImageInformationAmqpDto } from '@ap4/amqp';
import {ImageInformationDto, ReadImageDto, UploadImageDto} from '@ap4/api';
import { map, Observable } from 'rxjs';

@Controller('images')
@ApiTags('Images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':uuid/file')
  @ApiOperation({ description: 'Return a certain image' })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The uuid used to identify the image that should be returned',
    required: true,
  })
  @ApiResponse({  })
  @ApiResponse({ status: 200, description: 'The image with the given uuid', type: String })
  @ApiResponse({ status: 404, description: 'Image not found' })
  getImage(@Param('uuid') uuid: string): Observable<ReadImageDto> {
    return this.imagesService.getImage(uuid).pipe(
      map(image => {
        if (!image) {
          throw new NotFoundException('Image not found');
        }
        return image;
      })
    );
  }

  @Get(':uuid')
  @ApiOperation({ description: 'Return a certain image' })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The uuid used to identify the information about the image that should be returned',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'The image information with the given uuid', type: String })
  @ApiResponse({ status: 404, description: 'Image not found' })
  getImageInformation(@Param('uuid') uuid: string): Observable<ImageInformationDto> {
    return this.imagesService.getImageInformation(uuid).pipe(
      map(image => {
        if (!image) {
          throw new NotFoundException('Image not found');
        }
        return image;
      })
    );
  }

  @Get()
  @ApiOperation({ description: 'Get all stored image information' })
  @ApiQuery({
    name: 'sender',
    type: String,
    description: 'The sender name of the document.',
    required: false
  })
  @ApiQuery({
    name: 'receiver',
    type: String,
    description: 'The receiver name of the document.',
    required: false
  })
  @ApiQuery({
    name: 'analysisStatus',
    type: String,
    description: 'The analysisStatus name of the document.',
    required: false
  })
  @ApiQuery({
    name: 'documentType',
    type: String,
    description: 'The documentType name of the document.',
    required: false
  })
  @ApiQuery({
    name: 'bundleId',
    type: String,
    description: 'The bundleId name of the document.',
    required: false
  })
  @ApiResponse({ type: String, description: 'Every image information that is currently saved' })
  @ApiResponse({ status: 200, description: 'A list of the stored image information' })
  getAllImageInformation(
      @Query('sender') sender: string,
      @Query('receiver') receiver: string,
      @Query('analysisStatus') analysisStatus: string,
      @Query('documentType') documentType: string,
      @Query('bundleId') bundleId: string,
  ): Observable<ImageInformationDto[]> {
    return this.imagesService.getAllImageInformation(
        sender,
        receiver,
        analysisStatus,
        documentType,
        bundleId
    );
  }

  @Post()
  @ApiOperation({ description: 'Create a new image' })
  @ApiBody({
    type: UploadImageDto,
    required: true,
  })
  @ApiResponse({ status: 201, description: 'Image uploaded', type: ImageInformationAmqpDto })
  @ApiResponse({ status: 400, description: 'Wrong image format' })
  uploadImage(@Body() uploadImageDto: UploadImageDto): Observable<ImageInformationDto> {
    return this.imagesService.uploadImage(uploadImageDto).pipe(
      map(image => {
        if (!image) {
          throw new BadRequestException('The image is in the wrong format');
        }
        return image;
      })
    );
  }

  @Put(':uuid')
  @ApiOperation({ description: 'Update existing image information' })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The uuid used to identify the information about the image that should be updated',
    required: true,
  })
  @ApiBody({
    type: ImageInformationDto,
    required: true,
  })
  @ApiResponse({ status: 200, description: 'ImageInformation updated', type: ImageInformationAmqpDto })
  updateImageInformation(@Param('uuid') uuid: string, @Body() imageInformationDto: ImageInformationDto): Observable<ImageInformationDto> {
    return this.imagesService.updateImageInformation(uuid, imageInformationDto).pipe(
        map(response => {
          if (!response) {
            throw new NotFoundException('Image not found');
          }
          return response;
        })
    );
  }

  @Delete(':uuid')
  @ApiOperation({ description: 'Remove a certain image' })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The uuid used to identify the information that should be removed',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'The image information was successfully deleted', type: String })
  @ApiResponse({ status: 404, description: 'Image not found' })
  removeImage(@Param('uuid') uuid: string): Observable<boolean> {
    return this.imagesService.removeImage(uuid).pipe(
        map(response => {
          if (!response) {
            throw new NotFoundException('Image not found');
          }
          return response;
        })
    );
  }

  @Put('bundles/:uuid')
  @ApiOperation({ description: 'Analyze all documents of a certain bundle' })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The uuid used of the specified bundle',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'The image information elements of a certain bundle are sent to the DAS to be analyzed', type: String })
  @ApiResponse({ status: 404, description: 'BundleId not found' })
  analyzeImageBundle(@Param('uuid') uuid: string): Observable<boolean> {
    return this.imagesService.analyzeImageBundle(uuid).pipe(
        map(response => {
          if (!response) {
            throw new NotFoundException('Image bundle not found');
          }
          return response;
        })
    );
  }
}
