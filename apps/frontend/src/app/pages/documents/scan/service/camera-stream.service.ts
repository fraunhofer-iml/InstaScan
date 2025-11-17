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
export class CameraStreamService {
  url = environment.SOCKET.CAMERA_URL + CameraCommandsEnum.nsFrontend;
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

  /**
   * Subscribes to the document stream response.
   * @returns Observable emitting the server's document response as a string.
   */
  onDocumentResponse(): Observable<string> {
    return new Observable(observer => {
      this.socket.on(CameraCommandsEnum.uuid_topic, (uuid) => {
        observer.next(uuid);
      });
    });
  }

  /**
   * Subscribes to the camera's live image stream.
   * @returns Observable emitting image data in base64.
   */
  onImageStream(): Observable<string> {
    return new Observable(observer => {
      this.socket.on(CameraCommandsEnum.dsCameraLowresStream, (data) => {
        observer.next(CameraCommandsEnum.dataImage + data);
      });
    });
  }

  /**
   * Checks whether the camera is currently connected and active.
   * @returns Observable emitting `true` if the camera is active, otherwise `false`.
   */
  getCameraStatus(): Observable<boolean> {
    return this.isCameraConnected.asObservable();
  }

  /**
   * Triggers the camera to capture a single image frame.
   * The result is typically emitted through the image stream observable.
   */
  takeImage() {
    this.socket.emit(CameraCommandsEnum.feTakeImage);
  }

  /**
   * Closes the camera stream connection and cleans up any resources.
   * Should be called on component destruction or when the user stop scanning.
   */
  disconnect() {
    this.socket.disconnect();
  }
}
