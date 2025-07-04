/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AmqpBrokerQueues } from '@ap4/amqp';

async function bootstrap() {

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.BROKER_URI],
      queue: AmqpBrokerQueues.SKALA_AP4_STORAGE_SERVICE_QUEUE,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.listen().then(() =>
    Logger.log(
      `🔄 Storage service is running with RMQ:
        ${process.env.BROKER_URI}:${AmqpBrokerQueues.SKALA_AP4_STORAGE_SERVICE_QUEUE}`
    )
  );
}

bootstrap();
