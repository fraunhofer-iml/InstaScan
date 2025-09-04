/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import {
  AmqpBrokerQueues,
  ImageInformationAmqpDtoMocks
} from '@ap4/amqp';
import { firstValueFrom, of } from 'rxjs';
import {UploadImageDtoMocks, ImageInformationDtoMocks, ReadImageDtoMocks, ImageInformationDto} from '@ap4/api';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ImagesController', () => {
  let controller: ImagesController;
  let imagesService: ImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ImagesController],
      providers: [
        {
          provide: ImagesService,
          useValue: {
            uploadImage: jest.fn(),
            getImage: jest.fn(),
            getImageInformation: jest.fn(),
            getAllImageInformation: jest.fn(),
            removeImage: jest.fn(),
            updateImageInformation: jest.fn(),
            analyzeImageBundle: jest.fn(),
          },
        },
        {
          provide: AmqpBrokerQueues.SKALA_AP4_STORAGE_SERVICE_QUEUE,
          useValue: {
            send: jest.fn(),
          },
        },
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
        }
        ]
    }).compile();

    controller = module.get<ImagesController>(ImagesController);
    imagesService = module.get<ImagesService>(ImagesService) as ImagesService;
  });

  it('getImage: should get an image', (done) => {
    const imageServiceSpy = jest.spyOn(imagesService, 'getImage');
    imageServiceSpy.mockImplementation(() => {
      return of(ReadImageDtoMocks[0]);
    });

    controller.getImage(ImageInformationAmqpDtoMocks[0].uuid).subscribe((response) => {
      expect(imageServiceSpy).toHaveBeenCalledWith(ReadImageDtoMocks[0].uuid);
      expect(imageServiceSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(ReadImageDtoMocks[0]);
      done();
    });
  });

  it('getImage: should not get an image due to invalid uuid', async () => {
    const imageServiceSpy = jest.spyOn(imagesService, 'getImage');
    imageServiceSpy.mockImplementation(() => {
      return of(null);
    });
    await expect(firstValueFrom(controller.getImage(ImageInformationAmqpDtoMocks[0].uuid))).rejects.toThrow(NotFoundException);
  });

  it('getImageInformation: should get an imageInformation', (done) => {
    const imageServiceSpy = jest.spyOn(imagesService, 'getImageInformation');
    imageServiceSpy.mockImplementation(() => {
      return of(ImageInformationDtoMocks[0]);
    });

    controller.getImageInformation(ImageInformationAmqpDtoMocks[0].uuid).subscribe((response) => {
      expect(imageServiceSpy).toHaveBeenCalledWith(ImageInformationAmqpDtoMocks[0].uuid);
      expect(imageServiceSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(ImageInformationDtoMocks[0]);
      done();
    });
  });

  it('getImageInformation: should not get an imageInformation due to invalid uuid', async () => {
    const imageServiceSpy = jest.spyOn(imagesService, 'getImageInformation');
    imageServiceSpy.mockImplementation(() => {
      return of(null);
    });
    await expect(firstValueFrom(controller.getImageInformation(ImageInformationAmqpDtoMocks[0].uuid))).rejects.toThrow(NotFoundException);
  });

  it('getAllImageInformation: should get the image id list', (done) => {
    const imageServiceSpy = jest.spyOn(imagesService, 'getAllImageInformation');
    imageServiceSpy.mockImplementation(() => {
      return of(ImageInformationDtoMocks);
    });

    controller.getAllImageInformation(
        'testSender',
        'testReceiver',
        'testAnalysisStatus',
        'testDocumentType',
        'testBundleId'
    ).subscribe((response) => {
      expect(imageServiceSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(ImageInformationDtoMocks);
      done();
    });
  });

  it('uploadImage: should create an image', (done) => {
    const imageServiceSpy = jest.spyOn(imagesService, 'uploadImage');
    imageServiceSpy.mockImplementation(() => {
      return of(ImageInformationDtoMocks[0]);
    });

    controller.uploadImage(UploadImageDtoMocks[0]).subscribe((response) => {
      expect(imageServiceSpy).toHaveBeenCalledWith(UploadImageDtoMocks[0]);
      expect(imageServiceSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(ImageInformationDtoMocks[0]);
      done();
    });
  });

  it('uploadImage: should not create an image due to false input', async () => {
    const imageServiceSpy = jest.spyOn(imagesService, 'uploadImage');
    imageServiceSpy.mockImplementation(() => {
      return of(null);
    });
    await expect(firstValueFrom(controller.uploadImage(UploadImageDtoMocks[0]))).rejects.toThrow(BadRequestException);
  });

  it('updateImageInformation: should update image information', (done) => {
    const imageServiceSpy = jest.spyOn(imagesService, 'updateImageInformation');
    imageServiceSpy.mockImplementation(() => {
      return of(ImageInformationDtoMocks[0]);
    });

    controller.updateImageInformation(ImageInformationDtoMocks[0].uuid, ImageInformationDtoMocks[0]).subscribe((response) => {
      expect(imageServiceSpy).toHaveBeenCalledWith(ImageInformationDtoMocks[0].uuid, ImageInformationDtoMocks[0]);
      expect(imageServiceSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(ImageInformationDtoMocks[0]);
      done();
    });
  });

  it('updateImageInformation: should not update due to false input', async () => {
    const imageServiceSpy = jest.spyOn(imagesService, 'updateImageInformation');
    imageServiceSpy.mockImplementation(() => {
      return of(null);
    });
    await expect(firstValueFrom(controller.updateImageInformation(ImageInformationDtoMocks[0].uuid, ImageInformationDtoMocks[0]))).rejects.toThrow(NotFoundException);
  });

  it('removeImage: should remove an image', (done) => {
    const imageServiceSpy = jest.spyOn(imagesService, 'removeImage');
    imageServiceSpy.mockImplementation(() => {
      return of(true);
    });
    controller.removeImage(ImageInformationDtoMocks[0].uuid).subscribe((response) => {
      expect(imageServiceSpy).toHaveBeenCalledWith(ImageInformationDtoMocks[0].uuid);
      expect(imageServiceSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(true);
      done();
    });
  });

  it('removeImage: should not remove an image due to missing image', async () => {
    const imageServiceSpy = jest.spyOn(imagesService, 'removeImage');
    imageServiceSpy.mockImplementation(() => {
      return of(null);
    });
    await expect(firstValueFrom(controller.removeImage(ImageInformationDtoMocks[0].uuid))).rejects.toThrow(NotFoundException);
  });

  it('analyzeImageBundle: should send all images of a bundle to the DAS', (done) => {
    const imageServiceSpy = jest.spyOn(imagesService, 'analyzeImageBundle');
    imageServiceSpy.mockImplementation(() => {
      return of(true);
    });
    controller.analyzeImageBundle(ImageInformationDtoMocks[0].uuid).subscribe((response) => {
      expect(imageServiceSpy).toHaveBeenCalledWith(ImageInformationDtoMocks[0].uuid);
      expect(imageServiceSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(true);
      done();
    });
  });

  it('analyzeImageBundle: should not send images to the DAS when the bundle is missing', async () => {
    const imageServiceSpy = jest.spyOn(imagesService, 'analyzeImageBundle');
    imageServiceSpy.mockImplementation(() => {
      return of(null);
    });
    await expect(firstValueFrom(controller.analyzeImageBundle(ImageInformationDtoMocks[0].uuid))).rejects.toThrow(NotFoundException);
  });
});
