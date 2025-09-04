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

@Component({
  selector: 'app-upload-document',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, HttpClientModule],
  providers: [ImageService, PdfConverter],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent {
  document: FormControl = new FormControl(null, [Validators.required]);
  isUploading = false;

  constructor(
      public dialogRef: MatDialogRef<UploadComponent>,
      private readonly imageService: ImageService,
      private readonly pdfConverter: PdfConverter,
  ) {}

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

  submitDocument(): void {
    const reader = new FileReader();
    this.isUploading = true;
    reader.onload = () => {
      const mimeType: string = (reader.result as string).split(',')[0];
      const extension: string = mimeType.split('/')[1].split(';')[0].toUpperCase();
      const uploadType: DocumentUploadType = DocumentUploadType[extension as keyof typeof DocumentUploadType];
      const image_base64 = (reader.result as string).split(',')[1];
      if(uploadType == DocumentUploadType.PDF){
        from(this.pdfConverter.convertToPdf(image_base64)).pipe(
            switchMap(result => {
              return this.imageService.uploadImage({ image_base64: result, bundleId: 'testBundleId', documentUploadType: uploadType });
            })
        ).subscribe((image) => {
          this.isUploading = false;
          this.dialogRef.close(image);
        });
      }
      else{
        this.imageService.uploadImage({ image_base64: image_base64, bundleId: 'testBundleId', documentUploadType: uploadType }).subscribe((image) => {
          this.isUploading = false;
          this.dialogRef.close(image);
        });
      }
      this.document.setValue(null);
    };
    reader.readAsDataURL(this.document.value);
  }
}
