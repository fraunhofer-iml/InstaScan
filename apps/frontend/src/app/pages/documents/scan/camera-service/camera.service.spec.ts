/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { TestBed } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import { CameraStreamService } from "./camera-stream/camera-stream.service";
import { CameraService } from "./camera.service";
import { LocalCameraService } from "./local-camera/local-camera.service";

describe('CameraService', () => {
  let service: CameraService;
  let mockWebsocketService: Partial<CameraStreamService>;
  let mockLocalService: Partial<LocalCameraService>;

  let websocketStatus$: BehaviorSubject<boolean>;

  beforeEach(() => {
    websocketStatus$ = new BehaviorSubject<boolean>(false);

    mockWebsocketService = {
      initialize: jest.fn(),
      getCameraStatus: jest.fn(() => websocketStatus$.asObservable()),
      onImageStream: jest.fn(() => of('websocket-image')),
      onDocumentResponse: jest.fn(() => of('websocket-doc')),
      takeImage: jest.fn(),
      disconnect: jest.fn(),
    };

    mockLocalService = {
      initialize: jest.fn(),
      onImageStream: jest.fn(() => of('local-image')),
      onDocumentResponse: jest.fn(() => of('local-doc')),
      takeImage: jest.fn(),
      disconnect: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CameraService,
        { provide: CameraStreamService, useValue: mockWebsocketService },
        { provide: LocalCameraService, useValue: mockLocalService },
      ],
    });

    service = TestBed.inject(CameraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize websocket camera service on init', () => {
    expect(mockWebsocketService.initialize).toHaveBeenCalled();
  });

  it('should activate websocketService when connected', () => {
    websocketStatus$.next(true);
    service.getCameraStatus().subscribe(status => {
      expect(status).toBe(true);
    });
    expect(service['activeCameraService']).toBe(mockWebsocketService);
  });

  it('should fallback to localService when websocket disconnected', () => {
    websocketStatus$.next(false);
    expect(mockLocalService.initialize).toHaveBeenCalled();
    expect(service['activeCameraService']).toBe(mockLocalService);
  });

  it('should delegate initialize to activeCameraService', () => {
    service['activeCameraService'] = mockLocalService as CameraService;
    service.initialize();
    expect(mockLocalService.initialize).toHaveBeenCalled();
  });

  it('should delegate takeImage to activeCameraService', () => {
    service['activeCameraService'] = mockWebsocketService as CameraService;
    service.takeImage();
    expect(mockWebsocketService.takeImage).toHaveBeenCalled();
  });

  it('should delegate disconnect to activeCameraService', () => {
    service['activeCameraService'] = mockLocalService as CameraService;
    service.disconnect();
    expect(mockLocalService.disconnect).toHaveBeenCalled();
  });

  it('should delegate onImageStream to activeCameraService', (done) => {
    service['activeCameraService'] = mockLocalService as CameraService;
    service.onImageStream().subscribe((img) => {
      expect(img).toBe('local-image');
      done();
    });
  });

  it('should delegate onDocumentResponse to activeCameraService', (done) => {
    service['activeCameraService'] = mockWebsocketService as CameraService;
    service.onDocumentResponse().subscribe((doc) => {
      expect(doc).toBe('websocket-doc');
      done();
    });
  });

});