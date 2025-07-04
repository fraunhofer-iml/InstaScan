/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClientsModule, Transport } from '@nestjs/microservices';
import { DynamicModule } from '@nestjs/common';
import { AmqpBrokerQueues } from './amqp.broker.queues';

export class AmqpBroker {

  public getStorageServiceBroker(): DynamicModule {
    return this.getMessageBroker(AmqpBrokerQueues.SKALA_AP4_STORAGE_SERVICE_QUEUE);
  }

  public getDASBroker(): DynamicModule {
    return this.getMessageBroker(AmqpBrokerQueues.SKALA_AP4_DAS_QUEUE);
  }

  private getMessageBroker(queue: string): DynamicModule {
    const amqpUri = process.env['BROKER_URI'];

    if (!amqpUri) {
      throw new Error('AMQP_URI not defined');
    }

    return ClientsModule.register([
      {
        name: queue,
        transport: Transport.RMQ,
        options: {
          urls: [amqpUri],
          queue: queue,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]);
  }
}
