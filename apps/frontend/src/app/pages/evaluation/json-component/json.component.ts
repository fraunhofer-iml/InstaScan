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

  /**
   * Detemines whether the given value is a primitive (string, number, boolean, etc.).
   * @param value The value to test.
   * @returns `true` if the value is primitive; otherwise `false`
   */
  isPrimitive(value: string): boolean {
    return value === null || value === undefined || typeof value !== 'object';
  }

  /**
   * Checks if the given value represents an object.
   * @param value The value to test.
   * @returns `true` if the value is an object; otherwise `false`.
   */
  isObject(value: string): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  /**
   * Checks if the given value represents an array.
   * @param value The value to test.
   * @returns `true` if the value is an array; otherwise `false`.
   */
  isArray(value: string): boolean {
    return Array.isArray(value);
  }

  /**
   * Retrieves the keys of an object for iteration.
   * @param object The object to extract keys from.
   * @returns Array of keys.
   */
  getObjectKeys(object: string): string[] {
    return Object.keys(object);
  }

  /**
   * Formats a JSON key into a more human-readable label.
   * @param key The JSON property name.
   * @returns The formatted label string.
   */
  formatLabel(key: string): string {
    return key
      .replace(/[^a-zA-Z0-9.]+/g, ' ')
      .replace(/\./g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  /**
   * Handles user input changes in the JSON editor.
   * @param modified Whether the JSON content has been modified.
   */
  onInputChange(modified: boolean) {
    this.modified.emit(modified);
  }
}
