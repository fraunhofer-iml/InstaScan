/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResultAmqpDto } from '../analysis-result-amqp.dto';

export const AnalysisResultAmqpDtoMocks : AnalysisResultAmqpDto[] = [
  new AnalysisResultAmqpDto('testUuid', JSON.parse("{\"sender_information\":{\"senderNameCompany\":\"testSender\"},\"consignee_information\":{\"consigneeNameCompany\":\"testReceiver\"}}"), "CMR"),
  new AnalysisResultAmqpDto('testUuid', JSON.parse("{\"status\": \"error\",\"message\": \"An error occurred while processing the image.\",\"error_details\": \"Connection error.\"}"), "CMR"),
];
