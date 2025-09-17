/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ImageSubscribeController } from './image-subscribe.controller';
import { ImageGateway } from './image.gateway';
import { Server } from 'socket.io';

describe('ImageSubscribeController', () => {
  let controller: ImageSubscribeController;
  let gateway: ImageGateway;
  const mockServer = { emit: jest.fn() } as unknown as Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageSubscribeController],
      providers: [ImageGateway],
    }).compile();

    controller = module.get<ImageSubscribeController>(ImageSubscribeController);
    gateway = module.get<ImageGateway>(ImageGateway);

    gateway.server = mockServer;

    jest.clearAllMocks();
  });

  it('should call gateway.sendRefreshImageTable when handleImageUpdate is triggered', async () => {
    await controller.handleImageUpdate();
    expect(mockServer.emit).toHaveBeenCalledTimes(1);
  });
  it('should emit "refresh_image_table" with an empty object when sendRefresh is called', async () => {
    await gateway.sendRefreshImageTable();
    expect(mockServer.emit).toHaveBeenCalledTimes(1);
    expect(mockServer.emit).toHaveBeenCalledWith('refresh_image_table', {});
  });
});