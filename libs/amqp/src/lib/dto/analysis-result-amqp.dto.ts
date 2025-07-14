/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Schema } from "@ap4/api";

export class AnalysisResultAmqpDto {

  uuid: string;
  image_analysis_result: Schema;

  constructor(uuid: string, image_analysis_result: Schema) {
    this.uuid = uuid;
    this.image_analysis_result = image_analysis_result;
  }
}
