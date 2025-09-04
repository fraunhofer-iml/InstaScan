/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageDialogComponent } from './image-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

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

describe('ImageDialogComponent', () => {
  let component: ImageDialogComponent;
  let fixture: ComponentFixture<ImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageDialogComponent, BrowserAnimationsModule, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { image: 'test-image-base64' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
