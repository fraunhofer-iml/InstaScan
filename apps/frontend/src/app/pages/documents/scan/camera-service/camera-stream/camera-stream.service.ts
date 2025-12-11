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
import { CameraCommandsEnum } from '../../../../../shared/enums/camera-commands.enum';
import { environment } from '../../../../../../environments/environment';
import { ICameraService } from '../camera-utils/camera-service.interface';
import { SnackbarService } from 'apps/frontend/src/app/shared/services/snackbar/SnackBar.Service';
import { SnackbarMessagesEnum } from 'apps/frontend/src/app/shared/enums/snackbar-messages.enum';

@Injectable()
export class CameraStreamService implements ICameraService {
  url = environment.SOCKET.CAMERA_URL + CameraCommandsEnum.nsFrontend;
  private readonly socket: Socket;
  private lastConnectionState: boolean | null = null;
  isCameraConnected = new BehaviorSubject<boolean>(false);
  constructor(
    private readonly snackbar: SnackbarService
  ) {
    this.socket = io(this.url, { transports: ['websocket'] });
  }

  /**
   * 
   * Initializes WebSocket listeners responsible for tracking the camera’s connection status.
   *
   * This method sets up handlers for key camera-related socket events:
   *
   * - `connect` → Marks the camera as successfully connected.
   * - `disconnect` → Marks the camera as disconnected.
   * - `connectError` → Indicates a failed connection attempt.
   *
   * Each event updates the `isCameraConnected` BehaviorSubject, allowing components
   * to reactively update their UI based on real-time connection changes.
  */
  initialize(): void {
    this.socket.on(CameraCommandsEnum.connect, () => {
      this.updateConnectionState(true, SnackbarMessagesEnum.CAMERA_STREAM_CONNECTED);
    });
    this.socket.on(CameraCommandsEnum.disconnect, () => {
      this.updateConnectionState(false, SnackbarMessagesEnum.CAMERA_STREAM_DISCONNECT);
    });
    this.socket.on(CameraCommandsEnum.connectError, (error) => {
      this.updateConnectionState(null, SnackbarMessagesEnum.CAMERA_STREAM_ERROR + error);
    });
  }

  /**
 * Updates the internal camera connection state and displays a status message.
 *
 * This method prevents repeated snackbar notifications by only reacting when the
 * connection state actually changes. The new state is stored and emitted to all
 * subscribers, with `null` treated as a disconnected state.
 *
 * @param newState - The updated connection state. `true` for connected, `false` for
 *                   disconnected, and `null` for an unknown or error state.
 * @param message - The message that should be displayed to the user via the snackbar
 *                  when the state changes.
 */
  private updateConnectionState(newState: boolean | null, message: string) {
    if (this.lastConnectionState === newState) return;
    this.lastConnectionState = newState;
    this.isCameraConnected.next(newState ?? false);
    this.snackbar.sendMessage(message);
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
