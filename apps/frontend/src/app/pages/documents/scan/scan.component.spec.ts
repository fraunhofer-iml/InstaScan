/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScanComponent } from './scan.component';
import { By } from '@angular/platform-browser';
import { ImageStreamService } from './service/image-stream.service';
import { of } from 'rxjs';
import { ImageService } from '../../../shared/services/image/imageService';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { UploadComponent } from '../upload/upload.component';
import { ImageInformationDto } from '@ap4/api';
import { SnackbarService } from '../../../shared/services/snackbar/SnackBar.Service';

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

describe('ScanComponent', () => {
  let component: ScanComponent;
  let fixture: ComponentFixture<ScanComponent>;

  const imageServiceMock: jest.Mocked<ImageService> = {
    getImageFileByUuid: jest.fn(),
    analyzeImageBundle: jest.fn(),
    updateImageInformation: jest.fn(),
  } as never;

  const matDialogMock: jest.Mocked<MatDialog> = {
    open: jest.fn(),
  } as never;

  const snackBarMock = {
    sendMessage: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanComponent, HttpClientModule, BrowserAnimationsModule, NoopAnimationsModule],
      providers: [
        ImageStreamService,
        { provide: MatDialog, useValue: matDialogMock },
        { provide: ImageService, useValue: imageServiceMock },
        { provide: SnackbarService, useValue: snackBarMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render the image with correct src binding', () => {
    component.liveImage.subscribe((imageSrc) => {
      fixture.detectChanges();
      const imgElement = fixture.debugElement.query(By.css('#video'));
      expect(imgElement.nativeElement.src).toContain(imageSrc);
    });
  });
  it('should call captureImage method when button is clicked', () => { 
    jest.spyOn(component, 'captureImage'); 
    component.isCameraConnected = of(true);
    fixture.detectChanges(); 
    const button = fixture.debugElement.query(By.css('button[mat-flat-button]'));
    expect(button).toBeTruthy();
    button.nativeElement.click();
  });

  it('should open the dialog', () => {
    matDialogMock.open.mockReturnValue({
      afterClosed: () => of(null)
    } as unknown as MatDialogRef<UploadComponent>);

    component.openUploadDocument();

    expect(matDialogMock.open).toHaveBeenCalledWith(
      UploadComponent,
      expect.objectContaining({
        panelClass: 'mat-dialog-container',
        width: '600px',
        height: '400px'
      })
    );
  });

  it('should clean encodedImageFiles by confirm', () => {
    imageServiceMock.analyzeImageBundle.mockReturnValue(of(true));
    component.confirmBundle('bundleId');
    expect(component.encodedImageFiles.length).toBe(0);
  });

  it('should remove image by index', () => {
    component.encodedImageFiles = ['image1', 'image2'];
    component.removeImage(0);
    expect(component.encodedImageFiles).toEqual(['image2']);
  });

  it('should open image preview', () => {
    component.openImagePreview('encodedData');
    expect(matDialogMock.open).toHaveBeenCalledWith(ImageDialogComponent, expect.objectContaining({
      data: 'encodedData'
    }));
  });

  it('should clear images and encodedImageFiles and emit initializeDataSource on success', () => {
    const mockImage: ImageInformationDto = {
      uuid: 'uuid-1',
      sender: 'Innovatewerk GmbH',
      receiver: 'Fabricco',
      creationDate: new Date(),
      bundleId: 'bundle1',
    } as ImageInformationDto;

    jest.spyOn(component.initializeDataSource, 'emit');

    imageServiceMock.updateImageInformation.mockReturnValue(of(mockImage));
    imageServiceMock.analyzeImageBundle.mockReturnValue(of(true));

    component.images = [mockImage];
    component.encodedImageFiles = ['encodedData'];

    component.confirmBundle('bundle1');

    expect(component.images).toEqual([]);
    expect(component.encodedImageFiles).toEqual([]);
    expect(component.initializeDataSource.emit).toHaveBeenCalled();
  });
});
