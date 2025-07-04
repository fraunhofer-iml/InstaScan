/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ImageStreamService } from './service/image-stream.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-scan-document',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    providers: [ImageStreamService],
    templateUrl: './scan.component.html',
    styleUrl: './scan.component.css',
})
export class ScanComponent implements OnDestroy {
    liveImage: Observable<string>;
    isCameraConnected: Observable<boolean>;

    @Output() initializeDataSource: EventEmitter<void> =
        new EventEmitter<void>();

    constructor(private readonly imageStreamService: ImageStreamService) {
        this.liveImage = this.imageStreamService.onImageStream();
        this.isCameraConnected = this.imageStreamService.getCameraStatus();
    }
    ngOnDestroy(): void {
        this.imageStreamService.disconnect();
    }
    captureImage(): void {
        this.imageStreamService.takeImage();
        this.initializeDataSource.emit();
    }
}
