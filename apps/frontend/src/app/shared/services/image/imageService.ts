/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ReadImageDto, ImageInformationDto, UploadImageDto } from '@ap4/api';
import { AnalysisResultAmqpDto } from '@ap4/amqp'

@Injectable()
export class ImageService {
  constructor(private readonly httpClient: HttpClient) { }

  /**
   * Fetches an image file by its unique UUID.
   * @param uuid The unique identifier of the image.
   * @returns Observable containing the image file or metadata.
   */
  public getImageFileByUuid(uuid: string): Observable<ReadImageDto> {
    return this.httpClient.get<ReadImageDto>(`${environment.IMAGE.URL}/${uuid}/file`);
  }

  /**
   * Retrieves image metadata by its UUID.
   * @param uuid The unique identifier of the image.
   * @returns Observable containing image information.
   */
  public getImageByUuid(uuid: string): Observable<ImageInformationDto> {
    return this.httpClient.get<ImageInformationDto>(`${environment.IMAGE.URL}/${uuid}`);
  }

  /**
   * Retrieves a list of all stored images.
   * @returns Observable containing an array of image metadata.
   */
  public getImages(): Observable<ImageInformationDto[]> {
    return this.httpClient.get<ImageInformationDto[]>(environment.IMAGE.URL);
  }

  /**
   * Uploads a new image to the backend.
   * @param image The image data to be uploaded.
   * @returns Observable containing the UUID of the uploaded image.
   */
  public uploadImage(image: UploadImageDto): Observable<string> {
    return this.httpClient.post<string>(environment.IMAGE.URL, image);
  }

  /**
   * Fetches the analysis results for a specific image.
   * @param uuid The unique identifier of the image.
   * @returns Observable containing the analysis result data.
   */
  public getAnalysedImage(uuid: string): Observable<AnalysisResultAmqpDto> {
    return this.httpClient.get<AnalysisResultAmqpDto>(`${environment.IMAGE.URL_ANALYSIS}/${uuid}`);
  }

  /**
   * Updates image metadata.
   * @param uuid The unique identifier of the image to update.
   * @param imageInformationDto The updated image information.
   * @returns Observable containing the updated image data.
   */
  public updateImageInformation(uuid: string, imageInformationDto: ImageInformationDto): Observable<ImageInformationDto> {
    return this.httpClient.put<ImageInformationDto>(`${environment.IMAGE.URL}/${uuid}`, imageInformationDto);
  }

  /**
   * Deletes an image by its UUID.
   * @param uuid The unique identifier of the image to delete.
   * @returns Observable containing the remaining list of images.
   */
  public deleteImage(uuid: string): Observable<ImageInformationDto[]> {
    return this.httpClient.delete<ImageInformationDto[]>(`${environment.IMAGE.URL}/${uuid}`);
  }

  /**
   * Initiates an analysis of an image or image bundle.
   * @param uuid The unique identifier of the image or bundle to analyze.
   * @returns Observable emitting `true` if the analysis was successful.
   */
  public analyzeImageBundle(uuid: string): Observable<boolean> {
    return this.httpClient.put<boolean>(`${environment.IMAGE.URL_BUNDLES}/${uuid}`, null);
  }
}