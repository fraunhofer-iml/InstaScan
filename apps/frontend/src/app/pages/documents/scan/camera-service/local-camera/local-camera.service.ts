/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BehaviorSubject, Observable } from "rxjs";
import { ICameraService } from "../camera-utils/camera-service.interface";
import { SnackbarService } from "apps/frontend/src/app/shared/services/snackbar/SnackBar.Service";
import { ImageService } from "apps/frontend/src/app/shared/services/image/imageService";
import { DocumentTypeId, DocumentUploadType } from "@ap4/utils";
import { Injectable } from "@angular/core";
import { UploadImage } from "../camera-utils/upload-Image";
import { SnackbarMessagesEnum } from "apps/frontend/src/app/shared/enums/snackbar-messages.enum";

@Injectable()
export class LocalCameraService implements ICameraService {
  private video!: HTMLVideoElement;
  private canvas!: HTMLCanvasElement;
  private lastConnectionState: boolean | null = null;

  connected$ = new BehaviorSubject<boolean>(false);
  image$ = new BehaviorSubject<string>('');
  imageId$ = new BehaviorSubject<string>('');
  constructor(
    private readonly snackBarService: SnackbarService,
    private readonly imageService: ImageService
  ) {
    this.createElements();
  }

  /**
   * Creates and initializes the hidden HTML elements used for camera processing.
   *
   * This method dynamically adds a `<video>` element and a `<canvas>` element to
   * the DOM. Both elements remain hidden, as they are used internally to capture
   * camera frames. The canvas size is calculated using a REM → PX conversion to
   * ensure consistent scaling across different device font sizes.
   *
   * - The `<video>` element receives the live camera stream.
   * - The `<canvas>` element is used to draw video frames and convert them into
   *   Base64 images for further processing.
  */
  private createElements(): void {
    this.video = document.createElement('video');
    this.video.setAttribute('playsinline', '');
    this.video.style.display = 'none';
    document.body.appendChild(this.video);
    const remToPx = (rem: number) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

    this.canvas = document.createElement('canvas');
    this.canvas.width = remToPx(25);
    this.canvas.height = remToPx(25);
    this.canvas.style.display = 'none';
    document.body.appendChild(this.canvas);
  }

  /**
   * Initializes the camera stream by requesting access to the user's webcam.
   *
   * If the user grants permission, the method:
   *  - Assigns the video stream to the hidden `<video>` element.
   *  - Starts video playback.
   *  - Updates the `connected$` observable to `true`.
   *  - Begins continuous live frame capturing via `startLiveStreamCapture()`.
   *
   * If access is denied or an error occurs, `connected$` is set to `false`.
  */
  initialize(): void {
    navigator.mediaDevices.getUserMedia({video: true})
    .then((stream: MediaStream)=>{
      this.video.srcObject = stream;
      this.video.play();
      this.updateConnectionState(true, SnackbarMessagesEnum.LOCAL_CAMERA_CONNECTED);
      this.startLiveStreamCapture();
      this.startPermissionMonitoring();
    })
    .catch(()=>{
      this.updateConnectionState(null, SnackbarMessagesEnum.LOCAL_CAMERA_ERROR)
      this.startPermissionMonitoring();
    })
  }


  /**
   * Starts monitoring the camera permission status using the Permissions API if available.
   * Falls back to listening for device changes if Permissions API is not supported.
  */
  private startPermissionMonitoring(): void {
    if (navigator.permissions?.query) {
      navigator.permissions.query({ name: 'camera' as PermissionName })
        .then((status: PermissionStatus) => {
          this.handlePermissionState(status.state);
          status.addEventListener('change', () => this.handlePermissionState(status.state));
        })
        .catch(() => this.startDeviceChangeFallback());
    } else {
      this.startDeviceChangeFallback();
    }
  }

  /**
   * Handles changes to the camera permission state.
   * - If permission is granted, ensures the camera is initialized.
   * - If permission is denied or revoked, updates connection state and stops any active tracks.
  */
  private handlePermissionState(state: PermissionState): void {
    if (state === 'granted') {
      if (!this.connected$.value) this.initialize();
    } else {
      this.updateConnectionState(false, SnackbarMessagesEnum.LOCAL_CAMERA_ERROR);
      const stream = this.video?.srcObject as MediaStream | undefined;
      stream?.getTracks().forEach(track => track.stop());
    }
  }

  /**
   * Fallback for browsers that don’t support the Permissions API.
   * Listens to 'devicechange' events and checks if there is still a live camera track.
   * If not, updates the connection state to disconnected.
  */
  private startDeviceChangeFallback(): void {
    navigator.mediaDevices.addEventListener('devicechange', () => {
      const stream = this.video?.srcObject as MediaStream | undefined;
      const hasLiveTrack = !!stream?.getVideoTracks().find(videoTrack => videoTrack.readyState === 'live' || videoTrack.enabled);
      if (!hasLiveTrack) {
        this.updateConnectionState(false, SnackbarMessagesEnum.LOCAL_CAMERA_DISCONNECTED);
      }
    });
  }

  /**
   * Starts a continuous loop that captures live video frames and emits them as Base64 images.
   *
   * The method obtains the 2D drawing context of the internal canvas and repeatedly:
   *  - Draws the current video frame onto the canvas.
   *  - Converts the canvas content into a Base64-encoded JPEG.
   *  - Pushes the encoded frame into the `image$` BehaviorSubject.
   *
   * The loop runs via `requestAnimationFrame`, ensuring efficient, synchronized
   * rendering tied to the browser’s refresh rate. The loop stops automatically
   * if the camera becomes disconnected.
  */
  private startLiveStreamCapture(): void {
    const canvasContext = this.canvas.getContext('2d');
    if (!canvasContext) return;
    const draw = () => {
      if (!this.connected$.value) return;
      canvasContext.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      const frame = this.canvas.toDataURL('image/jpeg');
      this.image$.next(frame);
      requestAnimationFrame(draw);
    };
    draw();
  }

  /**
   * Updates the camera connection state while preventing repetitive notifications.
   * Only triggers when the connection state changes.
   *
   * @param newState - true (connected), false (disconnected), or null (unknown/error)
   * @param message - snackbar message to display when state changes
  */
  private updateConnectionState(newState: boolean | null, message: string) {
    if (this.lastConnectionState === newState) return;
    this.lastConnectionState = newState;
    this.connected$.next(newState ?? false);
    this.snackBarService.sendMessage(message);
  }

  /**
   * Subscribes to the camera's live image stream.
   * @returns Observable emitting image data in base64.
  */
  onImageStream(): Observable<string> {
    return this.image$.asObservable();
  }

  /**
   * Subscribes to the document stream response.
   * @returns Observable emitting the server's document response as a string.
  */
  onDocumentResponse(): Observable<string> {
    return this.imageId$.asObservable();
  }

  /**
   * Checks whether the camera is currently connected and active.
   * @returns Observable emitting `true` if the camera is active, otherwise `false`.
  */
  getCameraStatus(): Observable<boolean> {
    return this.connected$.asObservable();
  }

  /**
   * Triggers the camera to capture a single image frame.
   * The result is typically emitted through the image stream observable.
  */
  takeImage(): void{
    const dataUrl = this.image$.value;
    const base64 = dataUrl.split(',')[1];
    const mimeType = dataUrl.substring(dataUrl.indexOf(":") + 1, dataUrl.indexOf(";"));
    const extension = mimeType.split('/')[1].toUpperCase();
    const uploadType = DocumentUploadType[extension as keyof typeof DocumentUploadType];
    const image = new UploadImage(base64, '', uploadType, DocumentTypeId.CMR);
    this.imageService.uploadImage(image).subscribe((data) => {
      this.image$.next(dataUrl);
      this.imageId$.next(data.uuid);
    });
  }

  /**
   * Closes the local camera connection and cleans up any resources.
   * Should be called on component destruction or when the user stop scanning.
   */
  disconnect(): void {
    const stream = this.video?.srcObject as MediaStream;
    if (stream) stream.getTracks().forEach(t => t.stop());
    this.connected$.next(false);
  }
}