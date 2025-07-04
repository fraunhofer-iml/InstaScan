/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, model, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-json-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatExpansionModule
  ],
  templateUrl: './json.component.html',
  styleUrls: ['./json.component.scss'],
})
export class JsonComponent {
  // Using 'any' to support dynamic and flexible JSON data in the model.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data = model<any>();
  @Input() label = '';
  @Input() depth = 0;
  @Input() editable = true;
  @Output() modified = new EventEmitter<boolean>();
  isPrimitive(value: string): boolean {
    return value === null || value === undefined || typeof value !== 'object';
  }
  isObject(val: string): boolean {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
  }
  isArray(val: string): boolean {
    return Array.isArray(val);
  }
  getObjectKeys(obj: string): string[] {
    return Object.keys(obj);
  }
  formatLabel(key: string): string {
    return key
      .replace(/[^a-zA-Z0-9.]+/g, ' ')
      .replace(/\./g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, c => c.toUpperCase());
  }
  onInputChange(modified: boolean) {
    this.modified.emit(modified);
  }
}
