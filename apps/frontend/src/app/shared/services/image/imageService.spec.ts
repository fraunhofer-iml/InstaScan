/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ImageService } from './imageService';
import { ImageDto, ImageInformationDto } from '@ap4/api';
import { environment } from '../../../../environments/environment';
import { AnalysisStatus, DocumentTypeId } from '@ap4/utils';

describe('ImageService', (): void => {
  let service: ImageService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImageService],
    }).compileComponents();

    service = TestBed.inject(ImageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', (): void => {
    expect(service).toBeTruthy();
  });

  it('should fetch an image by UUID', () => {
    const mockImage: ImageInformationDto =
    {  uuid: '1',
      url: 'testUrl',
      creationDate: new Date('2025-04-03T06:24:59.535Z'),
      lastModified: new Date('2025-04-03T06:24:59.535Z'),
      analysisStatus: AnalysisStatus.IN_PROGRESS,
      documentType: DocumentTypeId.CMR,
      image_analysis_result: 'eyzwijh'
    };
    const uuid = '123';

    service.getImageByUuid(uuid).subscribe((image) => {
      expect(image).toEqual(mockImage);
    });

    const req = httpMock.expectOne(`${environment.IMAGE.URL}/${uuid}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockImage);
  });

  it('should fetch all images', () => {
    const mockImages: ImageInformationDto[] = [
      {  uuid: '1',
        url: 'testUrl',
        creationDate: new Date('2025-04-03T06:24:59.535Z'),
        lastModified: new Date('2025-04-03T06:24:59.535Z'),
        analysisStatus: AnalysisStatus.IN_PROGRESS,
        documentType: DocumentTypeId.CMR,
        image_analysis_result: 'eyzwijh'
      },
      {  uuid: '2',
        url: 'testUrl',
        creationDate: new Date('2025-04-03T06:24:59.535Z'),
        lastModified: new Date('2025-04-03T06:24:59.535Z'),
        analysisStatus: AnalysisStatus.IN_PROGRESS,
        documentType: DocumentTypeId.CMR,
        image_analysis_result: 'hsoflej'
      }
    ];

    service.getImages().subscribe((images) => {
      expect(images.length).toBe(2);
      expect(images).toEqual(mockImages);
    });

    const req = httpMock.expectOne(environment.IMAGE.URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockImages);
  });

  it('should upload an image and return a response string', () => {
    const newImage: ImageDto = { image_base64: 'eyzwijh'};
    const responseMessage = 'Image uploaded';

    service.uploadImage(newImage).subscribe((response) => {
      expect(response).toBe(responseMessage);
    });

    const req = httpMock.expectOne(environment.IMAGE.URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newImage);
    req.flush(responseMessage);
  });
  it('should fetch an analysed image by UUID', () => {
    const mockElement = { uuid: '1', image_analysis_result: 'eyzwijh'};
    const uuid = '123';

    service.getAnalysedImage(uuid).subscribe((element) => {
      expect(element).toEqual(mockElement);
    });

    const req = httpMock.expectOne(`${environment.IMAGE.URL_ANALYSIS}/${uuid}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockElement);
  });
  it('should update an analysed image by UUID', () => {
    const mockElement:ImageInformationDto = {
      uuid: '1', image_analysis_result: 'eyzwijh',
      url: '',
      creationDate: new Date(),
      lastModified: new Date(),
      analysisStatus: AnalysisStatus.IN_PROGRESS,
      documentType: DocumentTypeId.CMR
    };
    const uuid = '123';
    service.updateImageInformation(uuid,mockElement).subscribe((element) => {
      expect(element).toEqual(mockElement);
    });
    const req = httpMock.expectOne(`${environment.IMAGE.URL}/${uuid}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockElement);
  });
});
