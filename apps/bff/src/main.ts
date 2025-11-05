/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AmqpBrokerQueues } from '@ap4/amqp';
import { json } from 'body-parser';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.BROKER_URI],
      queue: AmqpBrokerQueues.SKALA_AP4_BFF_QUEUE,
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.startAllMicroservices();

  const config = new DocumentBuilder().setTitle('SKALA AP4 backend for frontend').setVersion('0.0').addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(json({ limit: '50mb' }));

  const port = process.env.PORT || 3000;
  app.enableCors();
  await app.listen(port);
  Logger.log(`🚀 AP4 Backend for Frontend is up and running`);
  Logger.log(`🌐 The HTTP endpoint can be reaches at: http://localhost:${port}`);
  Logger.log(`🔄 The AMQP endpoint can be reached at: ${process.env.BROKER_URI}:${AmqpBrokerQueues.SKALA_AP4_BFF_QUEUE}`);
}

bootstrap();
