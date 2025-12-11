/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocalCameraService } from './local-camera.service';
import { SnackbarService } from 'apps/frontend/src/app/shared/services/snackbar/SnackBar.Service';
import { ImageService } from 'apps/frontend/src/app/shared/services/image/imageService';
import { of } from 'rxjs';

describe('LocalCameraService', () => {
  let service: LocalCameraService;
  let mockSnackbar: { sendMessage: jest.Mock };
  let mockImageService: { uploadImage: jest.Mock };

  beforeEach(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      value: {
        getUserMedia: jest.fn(),
      },
    });

    Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
      configurable: true,
      writable: true,
      value: jest.fn().mockReturnValue('data:image/jpeg;base64,MOCKFRAME'),
    });

    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      writable: true,
      value: jest.fn().mockResolvedValue(undefined),
    });

    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      writable: true,
      value: jest.fn().mockReturnValue({
        drawImage: jest.fn(),
      }),
    });

    mockSnackbar = { sendMessage: jest.fn() };
    mockImageService = { uploadImage: jest.fn().mockReturnValue(of('mock-uuid')) };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LocalCameraService,
        { provide: SnackbarService, useValue: mockSnackbar },
        { provide: ImageService, useValue: mockImageService },
      ],
    });

    service = TestBed.inject(LocalCameraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize video and canvas elements', () => {
    expect(service['video']).toBeTruthy();
    expect(service['canvas']).toBeTruthy();
    expect(service['video'].tagName).toBe('VIDEO');
    expect(service['canvas'].tagName).toBe('CANVAS');
  });

  it('should start camera stream and update connected$ on success', async () => {
    const mockStream = {
      getTracks: jest.fn(() => []),
    } as unknown as MediaStream;

    jest.spyOn(navigator.mediaDevices, 'getUserMedia')
      .mockResolvedValue(mockStream);

    await service.initialize();

    service.connected$.subscribe(connected => {
      expect(connected).toBe(true);
    });
  });


  it('should capture image with takeImage and call imageService.uploadImage', () => {
    const mockCtx = { drawImage: jest.fn() };
    service['canvas'].getContext = jest.fn().mockReturnValue(mockCtx);

    service['image$'].next('data:image/jpeg;base64,MOCKBASE64DATA');

    service.takeImage();

    expect(mockImageService.uploadImage).toHaveBeenCalled();

    service.imageId$.subscribe(uuid => {
      expect(uuid).toBe('mock-uuid');
    });
  });

  it('should disconnect camera and stop tracks', () => {
    const stopMock = jest.fn();
    service['video'].srcObject = {
      getTracks: () => [{ stop: stopMock }],
    } as unknown as MediaStream;

    service.disconnect();

    service.connected$.subscribe(connected => {
      expect(connected).toBe(false);
    });

    expect(stopMock).toHaveBeenCalled();
  });
});
