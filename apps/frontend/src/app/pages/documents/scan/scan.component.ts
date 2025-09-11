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
import { ImageStreamService } from './service/image-stream.service';
import { catchError, forkJoin, Observable, of, switchMap } from 'rxjs';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { ImageService } from '../../../shared/services/image/imageService';
import { UploadComponent } from '../upload/upload.component';
import { MatDialog } from '@angular/material/dialog';
import { ImageInformationDto, ReadImageDto } from '@ap4/api';
import { DOCUMENT_UPLOAD_TYPE_TO_UPLOAD_VALUES } from '@ap4/utils';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { SnackbarService } from '../../../shared/services/snackbar/SnackBar.Service';
import { SnackbarMessagesEnum } from '../../../shared/enums/snackbar-messages.enum';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-scan-document',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFormField, MatLabel, MatInput, MatIcon, MatDivider, ReactiveFormsModule],
  providers: [ImageStreamService, SnackbarService],
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.css',
})
export class ScanComponent implements OnDestroy {
  liveImage: Observable<string>;
  isCameraConnected: Observable<boolean>;
  bundleId: FormControl<string | null> = new FormControl('', Validators.required);
  encodedImageFiles: string[] = [];
  images: ImageInformationDto[] | undefined = [];

  @Output() initializeDataSource: EventEmitter<void> =
    new EventEmitter<void>();

  constructor(
    private readonly imageStreamService: ImageStreamService,
    private readonly imageService: ImageService,
    private readonly dialog: MatDialog,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly snackBar: SnackbarService
  ) {
    this.liveImage = this.imageStreamService.onImageStream();
    this.isCameraConnected = this.imageStreamService.getCameraStatus();
    this.imageStreamService.onDocumentResponse().subscribe(uuid => {
        console.log('received new document with uuid', uuid);
        this.getImageInformation(uuid);
        this.getImageFile(uuid);
    });
  }
  ngOnDestroy(): void {
    this.imageStreamService.disconnect();
  }
  captureImage(): void {
    this.imageStreamService.takeImage();
    this.initializeDataSource.emit();
  }

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
        }
    });
  }

  confirmBundle(bundleId: string | null) {
    if (this.images && bundleId !== null){

    const images: Observable<ImageInformationDto>[] = this.images.map((image: ImageInformationDto) => {
      const updatedImageInformation: ImageInformationDto = { ...image, bundleId };
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
      this.bundleId.reset();
      this.initializeDataSource.emit();
    });
    }
  }

  getImageInformation(uuid: string){
    this.imageService.getImageByUuid(uuid).subscribe((image: ImageInformationDto) => {
          if(this.images){
            this.images.push(image);
          }
          this.changeDetectorRef.detectChanges();
        })
  }

  getImageFile(uuid: string){
    this.imageService.getImageFileByUuid(uuid).subscribe((image: ReadImageDto) => {
          const base64String = `${DOCUMENT_UPLOAD_TYPE_TO_UPLOAD_VALUES[image.documentUploadType].mimeType}${image.image_base64}`;
          this.encodedImageFiles.push(base64String);
          this.changeDetectorRef.detectChanges();
        })
  }

  removeImage(index: number) {
    this.encodedImageFiles.splice(index, 1);
    this.images?.splice(index, 1);
  }

  openImagePreview(encodedImageFile: string) {
    this.dialog.open(ImageDialogComponent, {
      data: encodedImageFile
    });
  }
}
