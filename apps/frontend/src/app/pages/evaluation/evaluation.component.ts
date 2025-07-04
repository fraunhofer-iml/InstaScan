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
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ImageDto, ImageInformationDto } from '@ap4/api';
import { AnalysisStatus } from '@ap4/utils'
import { ImageService } from '../../shared/services/image/imageService';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { JsonComponent } from './json-component/json.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ApproveButtonEnum } from '../../shared/enums/approve.button.enum';
import { SnackbarService } from '../../shared/services/snackbar/SnackBar.Service';
import { RoutingEnum } from '../../shared/enums/routing.enum';

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
  ],
  providers: [ImageService, SnackbarService],
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css'],
})
export class EvaluationComponent {
  id$!: Observable<string>;
  getImage!: ImageInformationDto;
  encodedImageFile: string | null = null;
  approveEnum = ApproveButtonEnum;
  analysisStatus = AnalysisStatus;
  showImage = true;
  modified = false;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly imageService: ImageService,
    private readonly snackBar: SnackbarService
  ) {
    this.id$ = this.route.params.pipe(map((params) => params['id']));
    this.id$.subscribe((id: string) => {
      this.imageService.getImageFileByUuid(id).subscribe((image: ImageDto) => {
        if(image?.image_base64){
          this.encodedImageFile = `data:image/jpeg;base64,${image.image_base64}`
        }
      });
      return this.imageService
        .getImageByUuid(id)
        .subscribe((image: ImageInformationDto) => {
          this.getImage = image;
          this.getImage.image_analysis_result = JSON.parse(
            image.image_analysis_result
          );
          return image;
        });
    });
  }
  saveImageInformation(uuid: string){
    this.imageService.updateImageInformation(uuid, this.getImage).subscribe(()=>{
      this.snackBar.sendMessage(this.approveEnum.done);
        this.router.navigate([RoutingEnum.documents]);
    });
  }
  onModified(modified: boolean) {
    this.modified = modified;
  }
}
