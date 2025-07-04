/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export class UploadImageAmqpDto {

  uuid: string;
  image_base64: string;

  constructor(uuid: string, image_base64: string) {
    this.uuid = uuid;
    this.image_base64 = image_base64;
  }
}
