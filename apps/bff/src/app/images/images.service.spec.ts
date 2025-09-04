/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import {
  AmqpBrokerQueues,
  ImageMessagePattern,
  ImageInformationAmqpDtoMocks,
  ImageInformationFilterAmqpDto,
} from '@ap4/amqp';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { UploadImageDtoMocks, ImageInformationDtoMocks} from '@ap4/api';

describe('ImagesService', () => {
  let service: ImagesService;
  let storageServiceClientProxy: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesService,
        {
          provide: AmqpBrokerQueues.SKALA_AP4_STORAGE_SERVICE_QUEUE,
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: AmqpBrokerQueues.SKALA_AP4_DAS_QUEUE,
          useValue: {
            send: jest.fn(),
            emit: jest.fn(),
          },
        }],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
    storageServiceClientProxy = module.get<ClientProxy>(AmqpBrokerQueues.SKALA_AP4_STORAGE_SERVICE_QUEUE) as ClientProxy;
  });

  it('getImage: should get an Image', (done) => {
    const sendImageRequestSpy = jest.spyOn(storageServiceClientProxy, 'send');
    sendImageRequestSpy.mockImplementation(() => {
      return of(UploadImageDtoMocks[0]);
    });

    service.getImage('testuuid').subscribe((response) => {
      expect(sendImageRequestSpy).toHaveBeenCalledWith(ImageMessagePattern.GET_IMAGE, 'testuuid');
      expect(response).toEqual(UploadImageDtoMocks[0]);
      done();
    });
  });

  it('getImageInformation: should get ImageInformation', (done) => {
    const sendImageRequestSpy = jest.spyOn(storageServiceClientProxy, 'send');
    sendImageRequestSpy.mockImplementation(() => {
      return of(ImageInformationAmqpDtoMocks[0]);
    });

    service.getImageInformation(ImageInformationAmqpDtoMocks[0].uuid).subscribe((response) => {
      expect(sendImageRequestSpy).toHaveBeenCalledWith(ImageMessagePattern.GET_IMAGE_INFORMATION, ImageInformationAmqpDtoMocks[0].uuid);
      expect(response).toEqual(ImageInformationAmqpDtoMocks[0]);
      done();
    });
  });

  it('getAllImageInformation: should read existing Image ids', (done) => {
    const sendImageRequestSpy = jest.spyOn(storageServiceClientProxy, 'send');
    sendImageRequestSpy.mockImplementation(() => {
      return of([ImageInformationAmqpDtoMocks[0].uuid]);
    });

    const imageInformationFilterAmqpDto: ImageInformationFilterAmqpDto = new ImageInformationFilterAmqpDto(
        'testSender',
        'testReceiver',
        'testAnalysisStatus',
        'testDocumentType',
        'testBundleId'
    );

    service.getAllImageInformation(
        'testSender',
        'testReceiver',
        'testAnalysisStatus',
        'testDocumentType',
        'testBundleId'
    ).subscribe((response) => {
      expect(sendImageRequestSpy).toHaveBeenCalledWith(ImageMessagePattern.GET_ALL_IMAGE_INFORMATION, imageInformationFilterAmqpDto);
      expect(response).toEqual([ImageInformationAmqpDtoMocks[0].uuid]);
      done();
    });
  });

  it('uploadImage: should create a new Image', (done) => {
    const sendImageRequestSpy = jest.spyOn(storageServiceClientProxy, 'send');
    sendImageRequestSpy.mockImplementation(() => {
      return of(ImageInformationAmqpDtoMocks[0].uuid);
    });

    service.uploadImage(UploadImageDtoMocks[0]).subscribe((response) => {
      expect(response).toEqual(ImageInformationAmqpDtoMocks[0].uuid);
      done();
    });
  });

  it('updateImageInformation: should update Image Information', (done) => {
    const sendImageRequestSpy = jest.spyOn(storageServiceClientProxy, 'send');
    sendImageRequestSpy.mockImplementation(() => {
      return of(ImageInformationDtoMocks[0].uuid);
    });

    service.updateImageInformation(ImageInformationDtoMocks[0].uuid, ImageInformationDtoMocks[0]).subscribe((response) => {
      expect(response).toEqual(ImageInformationDtoMocks[0].uuid);
      done();
    });
  });

  it('removeImage: should remove an Image', (done) => {
    const sendImageRequestSpy = jest.spyOn(storageServiceClientProxy, 'send');
    sendImageRequestSpy.mockImplementation(() => {
      return of(true);
    });

    service.removeImage(ImageInformationDtoMocks[0].uuid).subscribe((response) => {
      expect(response).toEqual(true);
      done();
    });
  });

  it('analyzeImageBundle: should analyze all images of an image bundle', (done) => {
    const sendImageRequestSpy = jest.spyOn(storageServiceClientProxy, 'send');
    sendImageRequestSpy.mockImplementation(() => {
      return of(true);
    });

    service.analyzeImageBundle('testBundleId').subscribe((response) => {
      expect(response).toEqual(true);
      done();
    });
  });
});
