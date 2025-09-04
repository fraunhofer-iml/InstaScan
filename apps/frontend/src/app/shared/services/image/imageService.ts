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
import {ReadImageDto, ImageInformationDto, UploadImageDto} from '@ap4/api';
import { AnalysisResultAmqpDto } from '@ap4/amqp'

@Injectable()
export class ImageService {
  constructor(private readonly httpClient: HttpClient) {}

  public getImageFileByUuid(uuid: string): Observable<ReadImageDto> {
    return this.httpClient.get<ReadImageDto>(`${environment.IMAGE.URL}/${uuid}/file`);
  }

  public getImageByUuid(uuid: string): Observable<ImageInformationDto> {
    return this.httpClient.get<ImageInformationDto>(`${environment.IMAGE.URL}/${uuid}`);
  }

  public getImages(): Observable<ImageInformationDto[]> {
    return this.httpClient.get<ImageInformationDto[]>(environment.IMAGE.URL);
  }

  public uploadImage(image: UploadImageDto): Observable<string> {
    return this.httpClient.post<string>(environment.IMAGE.URL, image);
  }

  public getAnalysedImage(uuid: string): Observable<AnalysisResultAmqpDto>{
    return this.httpClient.get<AnalysisResultAmqpDto>(`${environment.IMAGE.URL_ANALYSIS}/${uuid}`);
  }

  public updateImageInformation(uuid: string, imageInformationDto: ImageInformationDto): Observable<ImageInformationDto> {
    return this.httpClient.put<ImageInformationDto>(`${environment.IMAGE.URL}/${uuid}`, imageInformationDto);
  }

  public deleteImage(uuid: string): Observable<ImageInformationDto[]> {
    return this.httpClient.delete<ImageInformationDto[]>(`${environment.IMAGE.URL}/${uuid}`);
    }

  public analyzeImageBundle(uuid: string): Observable<boolean> {
    return this.httpClient.put<boolean>(`${environment.IMAGE.URL_BUNDLES}/${uuid}`, null);
  }
}
