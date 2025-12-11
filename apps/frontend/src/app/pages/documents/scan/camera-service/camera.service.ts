/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Observable } from "rxjs";
import { ICameraService } from "./camera-utils/camera-service.interface";
import { CameraStreamService } from "./camera-stream/camera-stream.service";
import { Injectable } from "@angular/core";
import { LocalCameraService } from "./local-camera/local-camera.service";

@Injectable()
export class CameraService implements ICameraService {
  private activeCameraService!: ICameraService;

  constructor(
    private readonly websocketService: CameraStreamService,
    private readonly localService: LocalCameraService
  ) {
    this.init();
  }

  /**
   * Initializes the switching logic between websocket camera and local camera.
   *
   * - Initializes the websocket camera service.
   * - Subscribes to its connection state.
   * - If connected → activate websocket camera.
   * - If disconnected → activate local camera (and initialize it).
   *
   * This ensures seamless automatic fallback if the remote camera is not available.
   */
  init(): void {
    this.websocketService.initialize();
    this.websocketService.getCameraStatus().subscribe(connected => {
      if (connected) {
        this.activeCameraService = this.websocketService;
      }
      else {
        this.activeCameraService = this.localService;
        this.activeCameraService.initialize();
      }
    })
  }


  /**
   * Calls initialize() on the currently active camera service.
   */
  initialize(): void {
    this.activeCameraService.initialize();
  }

  /**
   * Returns the active camera's live image stream.
   */
  onImageStream(): Observable<string> {
    return this.activeCameraService.onImageStream();
  }

  /**
   * Returns responses for document processing, delegated to the active service.
   */
  onDocumentResponse(): Observable<string> {
    return this.activeCameraService.onDocumentResponse();
  }

  /**
   * Returns the active camera's connection status observable.
   */
  getCameraStatus(): Observable<boolean> {
    return this.activeCameraService.getCameraStatus();
  }

  /**
   * Triggers an image capture on the currently active camera service.
   */
  takeImage(): void {
    this.activeCameraService.takeImage();
  }

  /**
   * Disconnects the currently active camera service.
   */
  disconnect(): void {
    this.activeCameraService.disconnect();
  }
}