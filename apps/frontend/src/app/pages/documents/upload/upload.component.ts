/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, Validators } from '@angular/forms';
import { ImageService } from '../../../shared/services/image/imageService';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { DocumentUploadType } from '@ap4/utils';
import { PdfConverter } from "./pdfConverter";
import { from, switchMap } from "rxjs";
import { SnackbarService } from '../../../shared/services/snackbar/SnackBar.Service';
import { UploadMessages } from '../const/upload-messages.enum';

@Component({
  selector: 'app-upload-document',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, HttpClientModule],
  providers: [ImageService, PdfConverter, SnackbarService],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent {
  document: FormControl = new FormControl(null, [Validators.required]);
  uploadMessages = UploadMessages;
  isUploading = false;
  uploadSuccessful = false;
  constructor(
    public dialogRef: MatDialogRef<UploadComponent>,
    private readonly imageService: ImageService,
    private readonly pdfConverter: PdfConverter,
    private readonly snackbarService: SnackbarService
  ) { }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.document.patchValue(file);
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;
    const file = target.files[0];
    this.document.patchValue(file);
  }

  onUploadSuccess(image: string): void {
    this.isUploading = false;
    this.uploadSuccessful = true;
    this.document.setValue(null);
    this.dialogRef.close(image);
    this.snackbarService.sendMessage(this.uploadMessages.UPLOAD_SUCCESS);
  }

  submitDocument(): void {
    const reader = new FileReader();
    this.isUploading = true;
    this.uploadSuccessful = false;
    reader.onloadend = () => {
      const mimeType: string = (reader.result as string).split(',')[0];
      const extension: string = mimeType.split('/')[1].split(';')[0].toUpperCase();
      const uploadType: DocumentUploadType = DocumentUploadType[extension as keyof typeof DocumentUploadType];
      const image_base64 = (reader.result as string).split(',')[1];
      if (uploadType == DocumentUploadType.PDF) {
        from(this.pdfConverter.convertToPdf(image_base64)).pipe(
          switchMap(result => {
            return this.imageService.uploadImage({ image_base64: result, bundleId: 'testBundleId', documentUploadType: uploadType });
          })
        ).subscribe((image) => {
          this.onUploadSuccess(image);
        });
      }
      else {
        this.imageService.uploadImage({ image_base64: image_base64, bundleId: 'testBundleId', documentUploadType: uploadType }).subscribe((image) => {
          this.onUploadSuccess(image);
        });
      }
    };
    reader.readAsDataURL(this.document.value);
  }
}
