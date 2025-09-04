/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-scan-document',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIcon],
  templateUrl: './image-dialog.component.html',
  styleUrl: './image-dialog.component.css',
})
export class ImageDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { image: string },
    public dialogRef: MatDialogRef<ImageDialogComponent>,
  ) {}
}
