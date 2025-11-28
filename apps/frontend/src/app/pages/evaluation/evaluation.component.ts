/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ReadImageDto, ImageInformationDto } from '@ap4/api';
import { AnalysisStatus, DOCUMENT_UPLOAD_TYPE_TO_UPLOAD_VALUES } from '@ap4/utils'
import { ImageService } from '../../shared/services/image/imageService';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { JsonComponent } from './json-component/json.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { SnackbarService } from '../../shared/services/snackbar/SnackBar.Service';
import { RoutingEnum } from '../../shared/enums/routing.enum';
import { SnackbarMessagesEnum } from '../../shared/enums/snackbar-messages.enum';
import { ApproveEnum } from './enum/approve.enum';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-pdf-preview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    HttpClientModule,
    MatExpansionModule,
    JsonComponent,
    RouterLink,
    MatIcon,
    RouterLinkActive,
  ],
  providers: [ImageService, SnackbarService],
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css'],
})
export class EvaluationComponent {
  imageId$!: Observable<string>;
  getImage!: ImageInformationDto;
  encodedImageFile: string | null = null;
  snackbarMessagesEnum = SnackbarMessagesEnum;
  analysisStatus = AnalysisStatus;
  showImage = true;
  modified = false;
  protected readonly approveEnum = ApproveEnum;
  protected readonly RoutingEnum = RoutingEnum;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly imageService: ImageService,
    private readonly snackBar: SnackbarService
  ) {
    this.imageId$ = this.route.params.pipe(map((params) => params['id']));
    this.initializeImage();
    this.initializeImageInformation();
  }

  /**
   * Initializes and displays the selected image for evaluation.
   */
  initializeImage() {
    this.imageId$.subscribe((id: string) => {
      this.imageService.getImageFileByUuid(id).subscribe((image: ReadImageDto) => {
        this.encodedImageFile = image?.image_base64 ? `${DOCUMENT_UPLOAD_TYPE_TO_UPLOAD_VALUES[image.documentUploadType].mimeType}${image.image_base64}` : null;
      })
    })
  }

  /**
   * Loads and displays the JSON data extracted from the analyzed image.
   */
  initializeImageInformation() {
    this.imageId$.subscribe((id: string) => {
      return this.imageService
        .getImageByUuid(id)
        .subscribe((image: ImageInformationDto) => {
          this.getImage = image;
          this.getImage.image_analysis_result = image.image_analysis_result
          return image;
        });
    })
  }

  /**
   * Saves any modified image information back to the server.
   * @param uuid The unique identifier of the image being saved.
   */
  saveImageInformation(uuid: string) {
    this.getImage.analysisStatus = this.analysisStatus.APPROVED;
    this.imageService.updateImageInformation(uuid, this.getImage).subscribe(() => {
      this.snackBar.sendMessage(
        this.modified
          ? this.snackbarMessagesEnum.SAVE_APPROVED
          : this.snackbarMessagesEnum.APPROVED
      );
      this.router.navigate([RoutingEnum.documents]);
    });
  }

  /**
   * Detects whether the JSON file has been modified compared to its original version.
   * @param modified `true` if modified, `false` otherwise.
   */
  onModified(modified: boolean) {
    this.modified = modified;
  }
}
