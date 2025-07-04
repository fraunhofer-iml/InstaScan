/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ImageDto {

  @ApiProperty()
  @IsNotEmpty()
  image_base64: string;

  constructor(imageBase64: string) {
    this.image_base64 = imageBase64;
  }
}
