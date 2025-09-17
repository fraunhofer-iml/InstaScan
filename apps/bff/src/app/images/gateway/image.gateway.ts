/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from "@nestjs/common";
import { Server } from 'socket.io';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/ws'
})
export class ImageGateway {
    @WebSocketServer()
    server: Server;

    async sendRefreshImageTable() {
        this.server.emit('refresh_image_table', {});
    }
}
