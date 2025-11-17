/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CameraStreamService } from './service/camera-stream.service';
import { catchError, forkJoin, Observable, of, switchMap } from 'rxjs';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { ImageService } from '../../../shared/services/image/imageService';
import { UploadComponent } from '../upload/upload.component';
import { MatDialog } from '@angular/material/dialog';
import { ImageInformationDto, ReadImageDto } from '@ap4/api';
import { DOCUMENT_UPLOAD_TYPE_TO_UPLOAD_VALUES, DocumentTypeId } from '@ap4/utils';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { SnackbarService } from '../../../shared/services/snackbar/SnackBar.Service';
import { SnackbarMessagesEnum } from '../../../shared/enums/snackbar-messages.enum';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BundleCharsEnum } from './enum/bundle-chars.enum';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-scan-document',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatDivider,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    FormsModule
  ],
  providers: [CameraStreamService, SnackbarService],
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.css',
})
export class ScanComponent implements OnDestroy {
  liveImage: Observable<string>;
  isCameraConnected: Observable<boolean>;
  bundleId: FormControl<string | null> = new FormControl('', Validators.required);
  encodedImageFiles: string[] = [];
  images: ImageInformationDto[] | undefined = [];
  documentTypes: DocumentTypeId[] = Object.values(DocumentTypeId);
  documentTypeSelections: string[] = [];

  @Output() initializeDataSource: EventEmitter<void> =
    new EventEmitter<void>();

  constructor(
    private readonly cameraStreamService: CameraStreamService,
    private readonly imageService: ImageService,
    private readonly dialog: MatDialog,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly snackBar: SnackbarService
  ) {
    this.generateBundleId();
    this.liveImage = this.cameraStreamService.onImageStream();
    this.isCameraConnected = this.cameraStreamService.getCameraStatus();
    this.cameraStreamService.onDocumentResponse().subscribe(uuid => {
      this.getImageInformation(uuid);
      this.getImageFile(uuid);
    });
  }

  /**
   * Indicates whether the 'Analyze' button should be diabled.
   */
  get isAnalyseDisabled(): boolean {
    return Boolean(this.encodedImageFiles.length === 0) ||
      Boolean(this.bundleId.invalid) ||
      this.documentTypeSelections.some(type => !type);
  }

  /**
   * Lifecycle hook called before he component is destroyed.
   * Used for cleanup and disconnecting streams.
   */
  ngOnDestroy(): void {
    this.cameraStreamService.disconnect();
  }

  /**
   * Captures an image using the connected camera or stream.
   */
  captureImage(): void {
    this.cameraStreamService.takeImage();
    this.initializeDataSource.emit();
    this.documentTypeSelections.push('');
  }

  /**
   * Opens a file upload dialog for selecting documents.
   */
  openUploadDocument() {
    const dialogRef = this.dialog.open(UploadComponent, {
      panelClass: 'mat-dialog-container',
      width: '38em',
      height: '28em',
    });

    dialogRef.afterClosed().subscribe((image: ImageInformationDto) => {
      if (image) {
        this.images?.push(image);
        this.getImageFile(image.uuid);
        this.documentTypeSelections.push('');
      }
    });
  }

  /**
   * Confirms an image bundle and assigns document type slections.
   * @param bundleId The unique bundle ID or `null` if not yet assigned.
   * @param documentTypeSelections Array of selected document types.
   */
  confirmBundle(bundleId: string | null, documentTypeSelections: string[]) {
    if (this.images && bundleId !== null) {
      const images: Observable<ImageInformationDto>[] = this.images.map((image: ImageInformationDto, index: number) => {
        const updatedImageInformation: ImageInformationDto = { ...image, bundleId, documentType: documentTypeSelections[index] };
        return this.imageService.updateImageInformation(image.uuid, updatedImageInformation);
      });

      forkJoin(images).pipe(
        switchMap(() =>
          this.imageService.analyzeImageBundle(bundleId).pipe(
            catchError(() => {
              this.snackBar.sendMessage(SnackbarMessagesEnum.ANALYSE_DOCUMENTS_FAILED);
              return of(null);
            })
          )
        )
      ).subscribe(() => {
        this.snackBar.sendMessage(SnackbarMessagesEnum.ANALYSE_DOCUMENTS);
        this.images = [];
        this.encodedImageFiles = [];
        this.documentTypeSelections = [];
        this.bundleId.reset();
        this.generateBundleId();
        this.initializeDataSource.emit();
      });
    }
  }

  /**
   * Retrieves metadata for specific image.
   * @param uuid The unique image ID.
   */
  getImageInformation(uuid: string) {
    this.imageService.getImageByUuid(uuid).subscribe((image: ImageInformationDto) => {
      if (this.images) {
        this.images.push(image);
      }
      this.changeDetectorRef.detectChanges();
    })
  }

  /**
   * Retrieves the actual image file for display or analysis.
   * @param uuid The unique image ID.
   */
  getImageFile(uuid: string) {
    this.imageService.getImageFileByUuid(uuid).subscribe((image: ReadImageDto) => {
      const base64String = `${DOCUMENT_UPLOAD_TYPE_TO_UPLOAD_VALUES[image.documentUploadType].mimeType}${image.image_base64}`;
      this.encodedImageFiles.push(base64String);
      this.changeDetectorRef.detectChanges();
    })
  }

  /**
   * Removes an image from the current list by index.
   * @param index The index of the image to remove.
   */
  removeImage(index: number) {
    this.generateBundleId();
    this.encodedImageFiles.splice(index, 1);
    this.images?.splice(index, 1);
    this.documentTypeSelections.splice(index, 1)
  }

  /**
   * Opens an image preview modal or component.
   * @param encodedImageFile The base64-encoded image data to preview.
   */
  openImagePreview(encodedImageFile: string) {
    this.dialog.open(ImageDialogComponent, {
      data: encodedImageFile,
      maxWidth: '100%',
      maxHeight: '100%'
    });
  }

  /**
   * Generates a unique ID for grouping scanned or uploaded images.
   */
  private generateBundleId(): void {
    const values = new Uint8Array(6);
    crypto.getRandomValues(values);
    this.bundleId.setValue(Array.from(values, (value) => {
      const index = value % BundleCharsEnum.CHARS.length;
      return BundleCharsEnum.CHARS[index];
    }).join(''));
  }
}
