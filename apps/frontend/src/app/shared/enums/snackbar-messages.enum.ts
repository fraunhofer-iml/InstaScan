/*!
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export enum SnackbarMessagesEnum {
  APPROVED = 'File was successfully approved.',
  SAVE_APPROVED = 'Changes were saved and File was successfully approved.',
  ANALYSE_DOCUMENTS = 'Bundle sent to analysation.',
  ANALYSE_DOCUMENTS_FAILED = 'Document analysis failed.',
  CAMERA_STREAM_CONNECTED = 'Camera stream successfully connected.',
  CAMERA_STREAM_DISCONNECT = 'Camera stream disconnected.',
  CAMERA_STREAM_ERROR = 'Camera stream error: Websocket error.',
  LOCAL_CAMERA_CONNECTED = 'Local camera successfully connected',
  LOCAL_CAMERA_DISCONNECTED = 'Camera device changed or disconnected.',
  LOCAL_CAMERA_ERROR = 'Local Camera error: Camera permission denied or prompt.',
  DELETE_IMAGE = 'Image successfully deleted.'
}
