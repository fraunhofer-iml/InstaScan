/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ImageInformationAmqpDto } from '@ap4/amqp';
import { ImageInformationDto, ReadImageDto, UploadImageDto } from '@ap4/api';
import { TokenReadDto } from 'nft-folder-blockchain-connector-besu';
import { map, Observable } from 'rxjs';
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImagesService } from './images.service';

@Controller('images')
@ApiTags('Images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  /**
   * Retrieves the image file associated with the given UUID.
   * @param uuid Unique identifier of the image.
   * @returns Stream containing image data.
   */
  @Get(':uuid/file')
  @ApiOperation({ description: 'Return a certain image' })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The uuid used to identify the image that should be returned',
    required: true,
  })
  @ApiResponse({})
  @ApiResponse({ status: 200, description: 'The image with the given uuid', type: String })
  @ApiResponse({ status: 404, description: 'Image not found' })
  getImage(@Param('uuid') uuid: string): Observable<ReadImageDto> {
    return this.imagesService.getImage(uuid).pipe(
      map((image) => {
        if (!image) {
          throw new NotFoundException('Image not found');
        }
        return image;
      })
    );
  }

  /**
   * Retrieves metadata and analysis information for the specified image.
   * @param uuid Unique identifier of the image.
   * @returns Metadata and analysis results.
   */
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
      map((image) => {
        if (!image) {
          throw new NotFoundException('Image not found');
        }
        return image;
      })
    );
  }

  /**
   * Retrieves NFT metadata associated with the given image.
   * @param uuid Unique image identifier.
   * @returns NFT/Token information
   */
  @Get('nft/:uuid')
  @ApiOperation({ description: 'Return the token information for an image' })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The uuid used to identify the nft of the image that should be returned',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'The nft with the given uuid', type: String })
  @ApiResponse({ status: 404, description: 'Nft not found' })
  getImageNft(@Param('uuid') uuid: string): Observable<TokenReadDto> {
    return this.imagesService.getImageNft(uuid).pipe(
      map((image) => {
        if (!image) {
          throw new NotFoundException('Nft not found');
        }
        return image;
      })
    );
  }

  /**
   * Retrieves a filtered list of image metadata entries.
   * @param sender Filter by sender address.
   * @param receiver Filter by receiver address.
   * @param analysisStatus Filter by analysis status.
   * @param documentType Filter by classified document type.
   * @param bundleId Filter by bundle identifier.
   * @returns Array of filtered image metadata entries.
   */
  @Get()
  @ApiOperation({ description: 'Get all stored image information' })
  @ApiQuery({
    name: 'sender',
    type: String,
    description: 'The sender name of the document.',
    required: false,
  })
  @ApiQuery({
    name: 'receiver',
    type: String,
    description: 'The receiver name of the document.',
    required: false,
  })
  @ApiQuery({
    name: 'analysisStatus',
    type: String,
    description: 'The analysisStatus name of the document.',
    required: false,
  })
  @ApiQuery({
    name: 'documentType',
    type: String,
    description: 'The documentType name of the document.',
    required: false,
  })
  @ApiQuery({
    name: 'bundleId',
    type: String,
    description: 'The bundleId name of the document.',
    required: false,
  })
  @ApiResponse({ type: String, description: 'Every image information that is currently saved' })
  @ApiResponse({ status: 200, description: 'A list of the stored image information' })
  getAllImageInformation(
    @Query('sender') sender: string,
    @Query('receiver') receiver: string,
    @Query('analysisStatus') analysisStatus: string,
    @Query('documentType') documentType: string,
    @Query('bundleId') bundleId: string
  ): Observable<ImageInformationDto[]> {
    return this.imagesService.getAllImageInformation(sender, receiver, analysisStatus, documentType, bundleId);
  }

  /**
   * Uploads a new image and stores both file and metadata.
   * @param uploadImageDto DTO containing image data and metadata
   * @returns Stored image metadata.
   */
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
      map((image) => {
        if (!image) {
          throw new BadRequestException('The image is in the wrong format');
        }
        return image;
      })
    );
  }

  /**
   * Updates metadata for the specified image.
   * @param uuid Image identifier.
   * @param imageInformationDto Updated metadata object
   * @returns Updated image metadata
   */
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
      map((response) => {
        if (!response) {
          throw new NotFoundException('Image not found');
        }
        return response;
      })
    );
  }

  /**
   * Deletes the specified image file and its metadata entry.
   * @param uuid Unique image identifier.
   * @returns True if deletion was successful.
   */
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
      map((response) => {
        if (!response) {
          throw new NotFoundException('Image not found');
        }
        return response;
      })
    );
  }

  /**
   * Triggers analysis for an entire image bundle starting from the given image.
   * @param uuid Identifier of an image inside the bundle.
   * @returns True if the analysis was initiated successfully.
   */
  @Put('bundles/:uuid')
  @ApiOperation({ description: 'Analyze all documents of a certain bundle' })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The uuid used of the specified bundle',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The image information elements of a certain bundle are sent to the DAS to be analyzed',
    type: String,
  })
  @ApiResponse({ status: 404, description: 'BundleId not found' })
  analyzeImageBundle(@Param('uuid') uuid: string): Observable<boolean> {
    return this.imagesService.analyzeImageBundle(uuid).pipe(
      map((response) => {
        if (!response) {
          throw new NotFoundException('Image bundle not found');
        }
        return response;
      })
    );
  }
}