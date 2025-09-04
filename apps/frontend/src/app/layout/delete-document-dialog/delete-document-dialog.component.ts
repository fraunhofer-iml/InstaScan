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
import { MatIcon } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-document',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIcon],
  templateUrl: './delete-document.component.html',
  styleUrl: './delete-document.component.css',
})
export class DialogDeleteDocumentComponent {
  constructor(protected readonly dialogRef: MatDialogRef<DialogDeleteDocumentComponent>) {}
}