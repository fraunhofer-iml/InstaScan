/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResultAmqpDto } from '../analysis-result-amqp.dto';

export const AnalysisResultAmqpDtoMocks : AnalysisResultAmqpDto[] = [
  new AnalysisResultAmqpDto('testUuid', JSON.stringify({ status: 'success' })),
  new AnalysisResultAmqpDto('testUuid', JSON.stringify({ status: 'error' })),
];
