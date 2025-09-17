/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { TestBed } from '@angular/core/testing';
import { io, Socket } from 'socket.io-client';
import { CameraStreamService } from './camera-stream.service';
import { environment } from '../../../../../environments/environment';
import { CameraCommandsEnum } from '../../../../shared/enums/camera-commands.enum';

jest.mock('socket.io-client');

describe('CameraStreamService', () => {
  let service: CameraStreamService;
  let mockSocket: Socket;

  beforeEach(() => {
    mockSocket = {
      on: jest.fn(),
      disconnect: jest.fn(),
    } as unknown as Socket;

    (io as jest.Mock).mockReturnValue(mockSocket);

    TestBed.configureTestingModule({
      providers: [CameraStreamService],
    });
    service = TestBed.inject(CameraStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize socket with correct URL', () => {
    expect(io).toHaveBeenCalledWith(environment.SOCKET.CAMERA_URL + CameraCommandsEnum.nsFrontend, { transports: ['websocket'] });
  });

  it('should set isCameraConnected to true on connect event', () => {
    const isConnectedSpy = jest.spyOn((service).isCameraConnected, 'next');
    const connectCallback = (mockSocket.on as jest.Mock).mock.calls.find(call => call[0] === CameraCommandsEnum.connect)?.[1];
    if (connectCallback) connectCallback();
    expect(isConnectedSpy).toHaveBeenCalledWith(true);
  });

  it('should set isCameraConnected to false on disconnect event', () => {
    const isConnectedSpy = jest.spyOn((service).isCameraConnected, 'next');
    const disconnectCallback = (mockSocket.on as jest.Mock).mock.calls.find(call => call[0] === CameraCommandsEnum.disconnect)?.[1];
    if (disconnectCallback) disconnectCallback();
    expect(isConnectedSpy).toHaveBeenCalledWith(false);
  });

  it('should set isCameraConnected to false on connection error event', () => {
    const isConnectedSpy = jest.spyOn((service).isCameraConnected, 'next');
    const connectErrorCallback = (mockSocket.on as jest.Mock).mock.calls.find(call => call[0] === CameraCommandsEnum.connectError)?.[1];
    if (connectErrorCallback) connectErrorCallback();
    expect(isConnectedSpy).toHaveBeenCalledWith(false);
  });

  it('should return camera status as observable', (done) => {
    service.getCameraStatus().subscribe(status => {
      expect(status).toBe(false);
      done();
    });
  });

  it('should receive image stream data', (done) => {
    const mockData = 'mock-image-data';
    const expectedData = CameraCommandsEnum.dataImage + mockData;
    
    service.onImageStream().subscribe((data) => {
      expect(data).toBe(expectedData);
      done();
    });
    
    const streamCallback = (mockSocket.on as jest.Mock).mock.calls.find(call => call[0] === CameraCommandsEnum.dsCameraLowresStream)?.[1];
    if (streamCallback) streamCallback(mockData);
  });

  it('should disconnect socket', () => {
    service.disconnect();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });
});
