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
import { MinioModule, MinioService } from 'nestjs-minio-client';
import process from 'node:process';
import { Readable } from 'stream';
import {
  AmqpBrokerQueues,
  AnalysisResultAmqpDtoMocks,
  ImageInformationFilterAmqpDto,
  UploadImageAmqpDtoMocks
} from '@ap4/amqp';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ImageInformationDto, ReadImageDto, UploadImageDtoMocks } from '@ap4/api';
import { ImageInformation } from '../entities/image.Information';
import { Repository } from 'typeorm';
import { ImageInformationMocks } from '../entities/mocks/image-Information-mocks';
import { ImageInformationDatabaseService } from "./image.information.database.service";
import { ImagesS3Service } from "./images.s3.service";
import { AmqpBrokerService } from "./amqp.broker.service";
import { ClientProxy } from "@nestjs/microservices";
import { DocumentUploadType } from '@ap4/utils';

describe('ImagesController', () => {
  let controller: ImagesController;
  let imageInformationRepository: Repository<ImageInformation>;
  let s3ServiceMock: MinioService;

  const testUuid = 'testUuid';
  const testEtag = 'testEtag';
  const readable = new Readable();
  readable.push(testUuid);
  readable.push(null);

  const mockedQueryBuilder = {
    andWhere: jest.fn(),
    getMany: jest.fn(),
  };

  const mockedMinioClient = {
    getObject: jest.fn().mockImplementation(() => readable),
    listObjects: jest.fn(),
    removeObjects: jest.fn(),
    bucketExists: jest.fn().mockImplementation(() => false),
    makeBucket: jest.fn(),
    putObject: jest.fn().mockImplementation(() => {
      return Promise.resolve(
        {
          etag: testEtag
        }
      )
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MinioModule.register({
          endPoint: process.env.S3_HOST || 'localhost',
          port: process.env.S3_PORT ? parseInt(process.env.S3_PORT) : 9000,
          useSSL: (process.env.S3_USESSL || 'false') === 'true',
          accessKey: process.env.S3_ACCESSKEY || '',
          secretKey: process.env.S3_SECRETKEY || '',
        })],
      controllers: [ImagesController],
      providers: [
        ImagesService,
        ImageInformationDatabaseService,
        ImagesS3Service,
        AmqpBrokerService,
        {
          provide: AmqpBrokerQueues.SKALA_AP4_DAS_QUEUE,
          useValue: {
            send: jest.fn(),
            emit: jest.fn(),
          },
        },
        {
          provide: AmqpBrokerQueues.SKALA_AP4_BFF_QUEUE,
          useValue: {
            send: jest.fn(),
            emit: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ImageInformation),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(() => mockedQueryBuilder),
          },
        },
        {
          provide: MinioService,
          useValue: {
            client: mockedMinioClient
          }
        },
      ],
    }).compile();

    controller = module.get<ImagesController>(ImagesController);
    imageInformationRepository = module.get<Repository<ImageInformation>>(getRepositoryToken(ImageInformation));
    s3ServiceMock = module.get<MinioService>(MinioService);
  });

  it('getImage: should get an image for an uuid', async () => {
    const getImageSpy = jest.spyOn(imageInformationRepository, 'findOne');
    getImageSpy.mockImplementationOnce(() => {
      return Promise.resolve(ImageInformationMocks[0]);
    });

    const returnValue: ReadImageDto = await controller.getImage(testUuid);
    const base64_mock_value = 'dGVzdFV1aWQ=';
    const expected: ReadImageDto = new ReadImageDto('testUuid', base64_mock_value, DocumentUploadType.JPEG);

    expect(expected).toEqual(returnValue);
  });

  it('getImage: should not get an image due to invalid uuid', async () => {
    const getImageSpy = jest.spyOn(imageInformationRepository, 'findOne');
    getImageSpy.mockImplementationOnce(() => {
      return null;
    });

    const returnValue: ReadImageDto = await controller.getImage(testUuid);

    expect(returnValue).toBeNull();
  });

  it('getImageInformation: should get image information', async () => {
    const getImageSpy = jest.spyOn(imageInformationRepository, 'findOne');
    getImageSpy.mockImplementationOnce(() => {
      return Promise.resolve(ImageInformationMocks[0]);
    });

    const expectedReturnValue = ImageInformationMocks[0].toImageInformationDto();

    const returnValue = await controller.getImageInformation('testUuid');
    expect(returnValue).toEqual(expectedReturnValue);
  });

  it('getImageInformation: should not get an image information if it is missing', async () => {
    const getImageSpy = jest.spyOn(imageInformationRepository, 'findOne');
    getImageSpy.mockImplementationOnce(() => {
      return Promise.resolve(null);
    });

    const returnValue = await controller.getImageInformation('testUuid');
    expect(returnValue).toBeNull();
  });

  it('getAllImageInformation: should get all image information', async () => {
    const getImageSpy = jest.spyOn(mockedQueryBuilder, 'getMany');
    getImageSpy.mockImplementationOnce(() => {
      return ImageInformationMocks;
    });
    const expectedReturnValue: ImageInformationDto[] = [
      ImageInformationMocks[0].toImageInformationDto(),
      ImageInformationMocks[1].toImageInformationDto(),
    ];
    const imageInformationFilterAmqpDto: ImageInformationFilterAmqpDto = new ImageInformationFilterAmqpDto(
      'testSender',
      'testReceiver',
      'testAnalysisStatus',
      'testDocumentType',
      'testBundleId'
    );
    const returnValue = await controller.getAllImageInformation(imageInformationFilterAmqpDto);
    expect(returnValue).toEqual(expectedReturnValue);
  });

  it('uploadImage: should upload an image', async () => {
    const saveImageSpy = jest.spyOn(imageInformationRepository, 'save');
    saveImageSpy.mockImplementationOnce(() => {
      return Promise.resolve(ImageInformationMocks[0]);
    });

    const expectedReturnValue = ImageInformationMocks[0].toImageInformationDto();

    const returnValue = await controller.uploadImage(UploadImageDtoMocks[0]);
    expect(returnValue).toEqual(expectedReturnValue);
  });

  it('updateImageInformation: should update a dataset of image information', async () => {
    const getImageSpy = jest.spyOn(imageInformationRepository, 'findOne');
    getImageSpy.mockImplementationOnce(() => {
      return Promise.resolve(ImageInformationMocks[0]);
    });

    const saveImageSpy = jest.spyOn(imageInformationRepository, 'save');
    saveImageSpy.mockImplementationOnce(() => {
      return Promise.resolve(ImageInformationMocks[0]);
    });

    const expectedReturnValue = ImageInformationMocks[0].toImageInformationAmqpDto();
    expectedReturnValue.sender = "testSender";
    expectedReturnValue.receiver = "testReceiver";

    const returnValue = await controller.updateImageInformation(ImageInformationMocks[0].toImageInformationDto());
    expect(returnValue).toEqual(expectedReturnValue);
  });

  it('removeImageInformation: should remove a dataset of image information', async () => {
    const getImageSpy = jest.spyOn(imageInformationRepository, 'findOne');
    getImageSpy.mockImplementationOnce(() => {
      return Promise.resolve(ImageInformationMocks[0]);
    });

    const returnValue = await controller.removeImage(ImageInformationMocks[0].uuid);
    expect(returnValue).toEqual(true);
  });

  it('removeImageInformation: should not remove a dataset if it is missing', async () => {
    const getImageSpy = jest.spyOn(imageInformationRepository, 'findOne');
    getImageSpy.mockImplementationOnce(() => {
      return Promise.resolve(null);
    });

    const returnValue = await controller.removeImage(ImageInformationMocks[0].uuid);
    expect(returnValue).toEqual(false);
  });

  it('analyzeImageBundle: should send all images of an image bundle to the DAS', async () => {
    const getImageSpy = jest.spyOn(mockedQueryBuilder, 'getMany');
    getImageSpy.mockImplementationOnce(() => {
      return [ImageInformationMocks[0]];
    });

    controller.analyzeImageBundle(ImageInformationMocks[0].uuid).then(returnValue => {
      expect(returnValue).toEqual(true);
    });
  });

  it('saveAnalysisResult: should save image information', async () => {
    const getImageSpy = jest.spyOn(imageInformationRepository, 'findOne');
    getImageSpy.mockImplementationOnce(() => {
      return Promise.resolve(ImageInformationMocks[0]);
    });

    const saveImageSpy = jest.spyOn(imageInformationRepository, 'save');
    saveImageSpy.mockImplementationOnce(() => {
      return Promise.resolve(ImageInformationMocks[0]);
    });

    const expectedReturnValue = ImageInformationMocks[0].toImageInformationAmqpDto();
    expectedReturnValue.sender = "testSender";
    expectedReturnValue.receiver = "testReceiver";

    const returnValue = await controller.saveAnalysisResult(AnalysisResultAmqpDtoMocks[0]);

    expect(returnValue).toEqual(expectedReturnValue);
  });

  it('saveAnalysisResult: should save a analysation failure', async () => {
    const getImageSpy = jest.spyOn(imageInformationRepository, 'findOne');
    getImageSpy.mockImplementationOnce(() => {
      return Promise.resolve(ImageInformationMocks[1]);
    });

    const saveImageSpy = jest.spyOn(imageInformationRepository, 'save');
    saveImageSpy.mockImplementationOnce(() => {
      return Promise.resolve(ImageInformationMocks[1]);
    });

    const expectedReturnValue = ImageInformationMocks[1].toImageInformationAmqpDto();

    const returnValue = await controller.saveAnalysisResult(AnalysisResultAmqpDtoMocks[1]);
    expect(returnValue).toEqual(expectedReturnValue);
  });
});
