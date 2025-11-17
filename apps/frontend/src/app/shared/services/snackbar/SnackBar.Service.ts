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

  constructor(private readonly snackBar: MatSnackBar) { }

  /**
   * Displays a snackbar message in the frontend.
   * @param message The text to be displayed to the user.
   */
  showSnackbar(message: string): void {
    this.snackBar.open(message, 'close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  /**
   * Returns an observable stream of snackbar messages.
   * Components can subscribe to this observable to react
   * whenever a new message is sent.
   * @returns Observable emitting snackbar messages.
   */
  getMessages() {
    return this.messageSubject.asObservable();
  }

  /**
   * Sends a message through the snackbar service.
   * Useful for programmatically triggering notifications.
   * @param message The message to send.
   */
  public sendMessage(message: string): void {
    this.messageSubject.next(message);
    this.showSnackbar(message);
  }
}
