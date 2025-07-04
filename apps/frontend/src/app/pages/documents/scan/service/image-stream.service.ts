/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { CameraCommandsEnum } from '../../../../shared/enums/camera-commands.enum';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class ImageStreamService {
  url = environment.CAMERA.URL + CameraCommandsEnum.nsFrontend;
  private readonly socket: Socket;
  isCameraConnected = new BehaviorSubject<boolean>(false);
  constructor() {
    this.socket = io(this.url, { transports: ['websocket'] });
    this.socket.on(CameraCommandsEnum.connect, () => {
      this.isCameraConnected.next(true);
    });
    this.socket.on(CameraCommandsEnum.disconnect, () => {
      this.isCameraConnected.next(false);
    });
    this.socket.on(CameraCommandsEnum.connectError, () => {
      this.isCameraConnected.next(false);
    });
  }
  onImageStream(): Observable<string> {
    return new Observable(observer => {
      this.socket.on(CameraCommandsEnum.dsCameraLowresStream, (data) => {
        observer.next(CameraCommandsEnum.dataImage + data);
      });
    });
  }
  getCameraStatus(): Observable<boolean> {
    return this.isCameraConnected.asObservable();
  }
  takeImage() {
    this.socket.emit(CameraCommandsEnum.feTakeImage);
  }
  disconnect() {
    this.socket.disconnect();
  }
}
