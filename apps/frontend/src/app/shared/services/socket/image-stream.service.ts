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
  connect() {
    if (this.socket) return;

    this.socket = io(`${environment.SOCKET.ANALYSIS_REFRESH_URL}`, {
      transports: ['websocket'],
    });

    this.socket.on('refresh_image_table', () => {
      this.update$.next();
    });
  }

  getUpdates(): Observable<void> {
    return this.update$.asObservable();
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = undefined;
  }
}
