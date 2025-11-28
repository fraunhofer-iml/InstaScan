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
import { DocumentTypeId, DocumentUploadType } from '@ap4/utils';
import { PdfConverter } from "./pdfConverter";
import { from, of, switchMap } from "rxjs";
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

  /**
   * Handles drag-over events to allow a file drop.
   * @param event The drag event.
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  /**
   * Handles a file drop and extracts files from the event.
   * @param event The drag event containing dropped files.
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.document.patchValue(file);
    }
  }

  /**
   * Handles file input selection via the upload button.
   * @param event The file input event.
   */
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;
    const file = target.files[0];
    this.document.patchValue(file);
  }

  /**
   * Callback executed when a file upload completes successfully.
   * @param image The uploaded image in base64-string.
   */
  onUploadSuccess(image: string): void {
    this.isUploading = false;
    this.uploadSuccessful = true;
    this.document.setValue(null);
    this.dialogRef.close(image);
    this.snackbarService.sendMessage(this.uploadMessages.UPLOAD_SUCCESS);
  }

  /**
   * Submits the uploaded document for processing or analysis.
   */
  submitDocument(): void {
    this.isUploading = true;
    this.uploadSuccessful = false;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const [mimeInfo, base64Data] = result.split(',');
      const extension = mimeInfo.split('/')[1].split(';')[0].toUpperCase();
      const uploadType = DocumentUploadType[extension as keyof typeof DocumentUploadType];

      const upload$ =
        uploadType === DocumentUploadType.PDF ? from(this.pdfConverter.convertToPdf(base64Data)) : of(base64Data);

      upload$.pipe(switchMap((processedBase64:string) =>
            this.imageService.uploadImage({
              image_base64: processedBase64,
              bundleId: 'testBundleId',
              documentUploadType: uploadType,
              documentType: DocumentTypeId.CMR,
            })
          )
        )
        .subscribe((image:string) => this.onUploadSuccess(image));
    };
    reader.readAsDataURL(this.document.value);
  }
}
