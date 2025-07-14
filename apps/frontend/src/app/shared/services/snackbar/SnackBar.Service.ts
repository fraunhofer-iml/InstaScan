/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable()
export class SnackbarService {
  private readonly messageSubject = new Subject<string>();

  constructor(private readonly snackBar: MatSnackBar) {}
  
  showSnackbar(message: string): void {
    this.snackBar.open(message, 'close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  getMessages() {
    return this.messageSubject.asObservable();
  }

  public sendMessage(message: string): void {
    this.messageSubject.next(message);
    this.showSnackbar(message);
  }
}
