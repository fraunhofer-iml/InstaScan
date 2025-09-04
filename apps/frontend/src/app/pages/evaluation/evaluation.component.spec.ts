/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { EvaluationComponent } from './evaluation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ImageService } from '../../shared/services/image/imageService';
import { SnackbarService } from '../../shared/services/snackbar/SnackBar.Service';
import { RoutingEnum } from '../../shared/enums/routing.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnalysisStatus, DocumentUploadType } from '@ap4/utils';
import {ErrorSchemaDto, ImageInformationDto, ReadImageDto} from '@ap4/api';
import { SnackbarMessagesEnum } from '../../shared/enums/snackbar-messages.enum';

jest.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: {
    workerSrc: 'pdf.worker.js',
  },
  getDocument: jest.fn().mockReturnValue(() => {
    return Promise.resolve({
      getPage: {
        getViewport: {
          height: 5,
          width: 5
        }
      }
    })
  })
}));

describe('EvaluationComponent', () => {
  let component: EvaluationComponent;
  let fixture: ComponentFixture<EvaluationComponent>;
  const mockRouter = { navigate: jest.fn() };
  const mockImage: ImageInformationDto = {
    uuid: '1234-uuid',
    documentUploadType: DocumentUploadType.JPEG,
    sender: 'testSender',
    receiver: 'testReceiver',
    creationDate: new Date(),
    lastModified: new Date(),
    analysisStatus: AnalysisStatus.APPROVED,
    documentType: 'CMR',
    bundleId: 'testBundleId',
    image_analysis_result:new ErrorSchemaDto('status', 'message', 'error_details'),
  };


  const mockImageService = {
    getImageByUuid: jest.fn().mockReturnValue(of(mockImage)),
    getImageFileByUuid: jest.fn().mockReturnValue(of({ image_base64: 'mockedBase64String' })),
    updateImageInformation: jest.fn().mockReturnValue(of(mockImage))
  };

  const mockActivatedRoute = {
    params: of({ id: '1234-uuid' })
  };
  const mockSnackbar = {
    sendMessage: jest.fn().mockReturnValue(SnackbarMessagesEnum.APPROVED),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationComponent, HttpClientTestingModule, BrowserAnimationsModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: ImageService, useValue: mockImageService },
        { provide: SnackbarService, userValue: mockSnackbar },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('returns base64-encoded image string using manual subscribe style', fakeAsync(() => {
    const imageId$ = of('1234-uuid');
    const image$ = mockImageService.getImageFileByUuid('1234-uuid');
    imageId$.subscribe(() => {
      image$.subscribe((image:ReadImageDto) => {
        const encoded = image?.image_base64
          ? `data:image/jpeg;base64,${image.image_base64}`
          : null;
        expect(encoded).toBe('data:image/jpeg;base64,mockedBase64String');
        tick();
      });
    });
  }));

  it('returns null when image or image_base64 is missing',  fakeAsync(() => {
    const id$ = of('1234-uuid');
    const image$ = of(null); 
    id$.subscribe(() => {
      image$.subscribe( (image:ReadImageDto | null) => {
        const encoded = image?.image_base64
          ? `data:image/jpeg;base64,${image.image_base64}`
          : null;
        expect(encoded).toBeNull();
        tick();
      });
    });
  }));
  
  it('should call initializationImage and set encodedImageFile', waitForAsync(() => {
    component.initializeImage();
    fixture.whenStable().then(() => {
      expect(mockImageService.getImageFileByUuid).toHaveBeenCalledWith('1234-uuid');
      expect(component.encodedImageFile).toBe('data:image/jpeg;base64,mockedBase64String');
    });
  }));
  it('should set encodedImageFile to null if image or image_base64 is missing', () => {
    component['imageId$'] = of('1234-uuid');
  
    jest.spyOn(mockImageService, 'getImageFileByUuid').mockReturnValue(of(null));
    component.initializeImage();
    expect(component.encodedImageFile).toBeNull();
  });
  
  it('should call initializationImageInformation and set getImage', waitForAsync(() => {
    component.initializeImageInformation();
    fixture.whenStable().then(() => {
      expect(mockImageService.getImageByUuid).toHaveBeenCalledWith('1234-uuid');
      expect(component.getImage).toEqual(mockImage);
    });
  }));
  
  it('should save image information and navigate correctly when modified is true', (() => {
    component.modified = true;
    component.getImage = { ...mockImage };
    component.saveImageInformation('1234-uuid');
    fixture.whenStable().then(() => {
      expect(mockImageService.updateImageInformation).toHaveBeenCalledWith('1234-uuid', mockImage);
      expect(mockRouter.navigate).toHaveBeenCalledWith([RoutingEnum.documents]);
    });
  }));

  it('should update modified flag via onModified()', () => {
    expect(component.modified).toBe(false);
    component.onModified(true);
    expect(component.modified).toBe(true);
  });

  it('should update image, send modified snackbar message and navigate when modified is true', async () => {
    component.modified = true;
    component.getImage = { ...mockImage }; 
  
    const updateSpy = jest.spyOn(mockImageService, 'updateImageInformation')
      .mockReturnValue(of(mockImage));
  
    const snackbarSpy = jest.spyOn(TestBed.inject(SnackbarService), 'sendMessage');
  
    await component.saveImageInformation('1234-uuid');
  
    fixture.whenStable().then(() => {
      expect(component.getImage.analysisStatus).toBe(component.analysisStatus.APPROVED);
      expect(updateSpy).toHaveBeenCalledWith('1234-uuid', component.getImage);
      expect(snackbarSpy).toHaveBeenCalledWith(component.snackbarMessagesEnum.SAVE_APPROVED);
      expect(mockRouter.navigate).toHaveBeenCalledWith([RoutingEnum.documents]);
    });
  });

  it('returns image and sets image_analysis_result manually via subscribe', async() => {
    const id$ = of('1234-uuid');
    const imageMock: ImageInformationDto = {
      uuid: '1234-uuid',
      documentUploadType: 'mock-url',
      sender: 'testSender',
      receiver: 'testReceiver',
      creationDate: new Date(),
      lastModified: new Date(),
      analysisStatus: AnalysisStatus.APPROVED,
      documentType: 'CMR',
      bundleId: 'testBundleId',
      image_analysis_result: {
        status: 'status',
        message: 'message',
        error_details: 'error_details'
      }
    };
  
    await component.initializeImageInformation();
    const image$ = of(imageMock);
  
    let result: ImageInformationDto | null = null;
  
    id$.subscribe(() => {
      image$.subscribe((image: ImageInformationDto) => {
        result = image;
        result.image_analysis_result = image.image_analysis_result;
  
        expect(result).toEqual(imageMock);
        expect(result.image_analysis_result).toEqual(imageMock.image_analysis_result);
      });
    });
  });

  it('updates image, sends snackbar message and navigates manually via subscribe', async () => {
    
    component.imageId$ = of('1234-uuid')
    component.getImage = mockImage;
    
    component.getImage.analysisStatus = AnalysisStatus.APPROVED;
  
    await mockImageService.updateImageInformation(component.imageId$, component.getImage).subscribe(() => {
      mockSnackbar.sendMessage(
        component.modified ? SnackbarMessagesEnum.SAVE_APPROVED : SnackbarMessagesEnum.APPROVED
      );
      mockRouter.navigate([RoutingEnum.documents]);
  
      expect(mockImageService.updateImageInformation).toHaveBeenCalledWith(component.imageId$, component.getImage);
      expect(mockSnackbar.sendMessage).toHaveBeenCalledWith(SnackbarMessagesEnum.SAVE_APPROVED);
      expect(mockRouter.navigate).toHaveBeenCalledWith([RoutingEnum.documents]);
    });
  });

});
