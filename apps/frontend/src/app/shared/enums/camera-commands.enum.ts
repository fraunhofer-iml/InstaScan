/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export enum CameraCommandsEnum {
    dsCameraLowresStream = "ds_camera_lowres_stream",
    feTakeImage = "fe_take_image",
    nsFrontend = "ns_frontend",
    dataImage = 'data:image/jpeg;base64,',
    connect = 'connect',
    disconnect = 'disconnect',
    connectError = 'connect_error',
}
