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
import {ImageDtoMocks, ImageInformationDtoMocks} from '@ap4/api';
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
            removeImageInformation: jest.fn()
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
    const getImageSpy = jest.spyOn(imagesService, 'getImage');
    getImageSpy.mockImplementation(() => {
      return of(ImageDtoMocks[0]);
    });

    controller.getImage(ImageInformationAmqpDtoMocks[0].uuid).subscribe((response) => {
      expect(getImageSpy).toHaveBeenCalledWith(ImageInformationAmqpDtoMocks[0].uuid);
      expect(getImageSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(ImageDtoMocks[0]);
      done();
    });
  });

  it('getImage: should not get an image due to invalid uuid', async () => {
    const getImageSpy = jest.spyOn(imagesService, 'getImage');
    getImageSpy.mockImplementation(() => {
      return of(null);
    });
    await expect(firstValueFrom(controller.getImage(ImageInformationAmqpDtoMocks[0].uuid))).rejects.toThrow(NotFoundException);
  });

  it('getImageInformation: should get an imageInformation', (done) => {
    const getImageSpy = jest.spyOn(imagesService, 'getImageInformation');
    getImageSpy.mockImplementation(() => {
      return of(ImageInformationAmqpDtoMocks[0]);
    });

    controller.getImageInformation(ImageInformationAmqpDtoMocks[0].uuid).subscribe((response) => {
      expect(getImageSpy).toHaveBeenCalledWith(ImageInformationAmqpDtoMocks[0].uuid);
      expect(getImageSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(ImageInformationAmqpDtoMocks[0]);
      done();
    });
  });

  it('getImageInformation: should not get an imageInformation due to invalid uuid', async () => {
    const getImageSpy = jest.spyOn(imagesService, 'getImageInformation');
    getImageSpy.mockImplementation(() => {
      return of(null);
    });
    await expect(firstValueFrom(controller.getImageInformation(ImageInformationAmqpDtoMocks[0].uuid))).rejects.toThrow(NotFoundException);
  });

  it('getAllImageInformation: should get the image id list', (done) => {
    const getImagesSpy = jest.spyOn(imagesService, 'getAllImageInformation');
    getImagesSpy.mockImplementation(() => {
      return of(ImageInformationAmqpDtoMocks);
    });

    controller.getAllImageInformation().subscribe((response) => {
      expect(getImagesSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(ImageInformationAmqpDtoMocks);
      done();
    });
  });

  it('uploadImage: should create an image', (done) => {
    const createImageSpy = jest.spyOn(imagesService, 'uploadImage');
    createImageSpy.mockImplementation(() => {
      return of(ImageInformationAmqpDtoMocks[0]);
    });

    controller.uploadImage(ImageDtoMocks[0]).subscribe((response) => {
      expect(createImageSpy).toHaveBeenCalledWith(ImageDtoMocks[0]);
      expect(createImageSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(ImageInformationAmqpDtoMocks[0]);
      done();
    });
  });

  it('uploadImage: should not create an image due to false input', async () => {
    const createImageSpy = jest.spyOn(imagesService, 'uploadImage');
    createImageSpy.mockImplementation(() => {
      return of(null);
    });
    await expect(firstValueFrom(controller.uploadImage(ImageDtoMocks[0]))).rejects.toThrow(BadRequestException);
  });

  it('removeImage: should remove an image', (done) => {
    const removeImageSpy = jest.spyOn(imagesService, 'removeImageInformation');
    removeImageSpy.mockImplementation(() => {
      return of(true);
    });
    controller.removeImageInformation(ImageInformationDtoMocks[0].uuid).subscribe((response) => {
      expect(removeImageSpy).toHaveBeenCalledWith(ImageInformationDtoMocks[0].uuid);
      expect(removeImageSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(true);
      done();
    });
  });

  it('removeImage: should not remove an image due to missing image', async () => {
    const removeImageSpy = jest.spyOn(imagesService, 'removeImageInformation');
    removeImageSpy.mockImplementation(() => {
      return of(null);
    });
    await expect(firstValueFrom(controller.removeImageInformation(ImageInformationDtoMocks[0].uuid))).rejects.toThrow(NotFoundException);
  });
});
