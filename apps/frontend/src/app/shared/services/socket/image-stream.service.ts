/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ImageStreamService {
  private socket?: Socket;
  private readonly update$ = new Subject<void>();

  /**
   * Establishes a connection to the image stream.
   * Typically used to open a WebSocket or SSE connection
   * for receiving live image or analysis data
   */
  connect() {
    if (this.socket) return;

    this.socket = io(`${environment.SOCKET.ANALYSIS_REFRESH_URL}`, {
      transports: ['websocket'],
    });

    this.socket.on('refresh_image_table', () => {
      this.update$.next();
    });
  }

  /**
   * Returns an observable that emits updates from the image stream.
   * Subscribers receive new data as soon as it is available.
   * @returns Observable emitting image updates or stream events.
   */
  getUpdates(): Observable<void> {
    return this.update$.asObservable();
  }

  /**
   * Closes the existing connection to the image stream.
   * Should be called when streaming is no longer needed
   * to release network and system resources.
   */
  disconnect() {
    this.socket?.disconnect();
    this.socket = undefined;
  }
}
