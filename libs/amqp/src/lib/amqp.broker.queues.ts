/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export class AmqpBrokerQueues{
  public static SKALA_AP4_STORAGE_SERVICE_QUEUE = process.env['AMQP_QUEUE_PREFIX'] + 'SKALA_AP4_STORAGE_SERVICE_QUEUE';
  public static SKALA_AP4_DAS_QUEUE = process.env['AMQP_QUEUE_PREFIX'] + 'SKALA_AP4_DAS_QUEUE';
  public static SKALA_AP4_BFF_QUEUE = process.env['AMQP_QUEUE_PREFIX'] + 'SKALA_AP4_BFF_QUEUE';
}
