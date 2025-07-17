/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {Controller, Get, Post, Param, Body, NotFoundException, BadRequestException, Put, Delete} from '@nestjs/common';
import { ImagesService } from './images.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImageInformationAmqpDto } from '@ap4/amqp';
import { ImageDto, ImageInformationDto } from '@ap4/api';
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
  getImage(@Param('uuid') uuid: string): Observable<ImageDto> {
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
  @ApiResponse({ type: String, description: 'Every image information that is currently saved' })
  @ApiResponse({ status: 200, description: 'A list of the stored image information' })
  getAllImageInformation(): Observable<ImageInformationDto[]> {
    return this.imagesService.getAllImageInformation();
  }

  @Post()
  @ApiOperation({ description: 'Create a new image' })
  @ApiBody({
    type: ImageDto,
    required: true,
  })
  @ApiResponse({ status: 201, description: 'Image uploaded', type: ImageInformationAmqpDto })
  @ApiResponse({ status: 400, description: 'Wrong image format' })
  uploadImage(@Body() createImageDto: ImageDto): Observable<ImageInformationDto> {
    return this.imagesService.uploadImage(createImageDto).pipe(
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
    return this.imagesService.updateImageInformation(uuid, imageInformationDto);
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
  removeImageInformation(@Param('uuid') uuid: string): Observable<boolean> {
    return this.imagesService.removeImageInformation(uuid).pipe(
        map(response => {
          if (!response) {
            throw new NotFoundException('Image not found');
          }
          return response;
        })
    );
  }
}
