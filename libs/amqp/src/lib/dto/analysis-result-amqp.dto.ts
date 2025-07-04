/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export class AnalysisResultAmqpDto {

  uuid: string;
  image_analysis_result: string;

  constructor(uuid: string, image_analysis_result: string) {
    this.uuid = uuid;
    this.image_analysis_result = image_analysis_result;
  }
}
