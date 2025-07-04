# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

"""This module provides functionality to receive and process messages from a RabbitMQ queue."""

import base64
import logging
import time
from typing import Callable

import pika

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


class RabbitMQReceiver:
    """A class to receive messages from a RabbitMQ queue."""

    def __init__(self, queue_name: str, uri: str, username: str, password: str) -> None:
        """Initialize the RabbitMQReceiver with the given parameters.

        :param queue_name: The name of the RabbitMQ queue.
        :param uri: The URI of the RabbitMQ server.
        :param username: The username for RabbitMQ authentication.
        :param password: The password for RabbitMQ authentication.
        """
        self.queue_name = queue_name
        self.uri = uri
        self.username = username
        self.password = password
        self.connection: pika.BlockingConnection | None = None
        self.channel = None
        # Direkter Verbindungsaufbau im Konstruktor
        self.connect()

    def connect(self) -> None:
        """Establish a connection to RabbitMQ with the provided credentials."""
        retries = 5
        while retries > 0:
            try:
                logger.info("Connecting to RabbitMQ at %s", self.uri)
                logger
                credentials = pika.PlainCredentials(self.username, self.password)
                parameters = pika.ConnectionParameters(self.uri, 5672, "/", credentials)
                self.connection = pika.BlockingConnection(parameters)
                self.channel = self.connection.channel()
                self.channel.queue_declare(queue=self.queue_name)  # type: ignore[attr-defined]
                logger.info("RabbitMQ connection established to %s", self.uri)
                return
            except pika.exceptions.AMQPConnectionError as e:
                retries -= 1
                logger.error(
                    "Error connecting to RabbitMQ: %s. Retrying... %d attempts left.", e, retries
                )
                time.sleep(5)  # Wartezeit zwischen den Verbindungsversuchen
        raise pika.exceptions.AMQPConnectionError(
            "ERROR: Failed to connect to RabbitMQ after multiple retries"
        )

    def start_listening(self, callback: Callable[[object, object], None]) -> None:
        """Start waiting for messages in the queue and executes the callback."""
        if not self.connection or not self.channel:
            raise pika.exceptions.AMQPConnectionError(
                "ERROR: RabbitMQ connection not established."
            )

        # Wenn die Verbindung da ist, Nachrichten konsumieren
        logger.info(f"Listening to queue: {self.queue_name}")
        self.channel.basic_consume(
            queue=self.queue_name, on_message_callback=callback, auto_ack=True
        )
        self.channel.start_consuming()

    def stop(self) -> None:
        """Stop the RabbitMQ connection."""
        if self.connection:
            self.connection.close()
            logger.info("RabbitMQ connection closed.")


def decode_image_from_message(body: bytes) -> bytes:
    """Decode base64 image data from message body."""
    image_data = base64.b64decode(body)
    return image_data
