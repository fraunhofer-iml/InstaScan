/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadComponent } from './upload.component';
import { ImageService } from "../../../shared/services/image/imageService";
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadComponent, MatDialogModule],
      providers: [
          ImageService,
          { provide: MatDialogRef, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a required validator on document FormControl', () => {
    expect(component.document.validator).toBeTruthy();
    component.document.setValue(null);
    expect(component.document.valid).toBeFalsy();
  });

  it('should prevent default behavior on drag over', () => {
    const event: Partial<DragEvent> = { preventDefault: jest.fn() };
    component.onDragOver(event as DragEvent);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should set document value on file drop', () => {
    const file = new File(['document'], 'document.txt', { type: 'text/plain' });
    const event = {
      preventDefault: jest.fn(),
      dataTransfer: { files: [file] },
    } as unknown as DragEvent;

    component.onDrop(event);
    expect(component.document.value).toBe(file);
  });

  it('should set document value on file selection', () => {
    const file = new File(['dcument'], 'document.txt', { type: 'text/plain' });
    const event = {
      target: { files: [file] },
    } as unknown as Event;

    component.onFileSelected(event);
    expect(component.document.value).toBe(file);
  });

  it('should call imageService.uploadImage and reset document on submit', () => {
    const fileMock = new Blob(['file'], { type: 'image/png' });
    jest.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function (this: FileReader) {
      setTimeout(() => {
        this.onload?.({ target: { result: 'mockBase64Data' } } as ProgressEvent<FileReader>);
      }, 0);
    });
    component.document.setValue(fileMock);
    component.submitDocument();
  });
});
