# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

"""This module contains the main entry point for the document analyzation service. It sets up the RabbitMQ receiver to listen for image messages, processes the images, and sends the results to a specified queue."""

import json
import logging
import os
from typing import Any

import pika
from dotenv import load_dotenv

from document_analyzation_service.image_processor import (
    convert_image_to_data_url,
    process_image,
)
from document_analyzation_service.message_broker import (
    RabbitMQReceiver,
    decode_image_from_message,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Move QUEUE_NAMES to a configuration file
AMQP_QUEUE_PREFIX = os.getenv("AMQP_QUEUE_PREFIX", "auavp-dev-")
RECEIVE_QUEUE_NAME = AMQP_QUEUE_PREFIX + "SKALA_AP4_DAS_QUEUE"
SEND_QUEUE_NAME = AMQP_QUEUE_PREFIX + "SKALA_AP4_STORAGE_SERVICE_QUEUE"
SAVE_ANALYZATION_RESULT_PATTERN = "analysis/publish"
RABBITMQ_URI = os.getenv("RABBITMQ_HOST")
RABBITMQ_USER = os.getenv("RABBITMQ_USER")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD")


def on_image_received(
    ch: pika.channel.Channel,
    method: pika.spec.Basic.Deliver,
    properties: pika.spec.BasicProperties,
    body: bytes,
) -> None:
    """Trigger when an image message with UUID is received.

    Args:
        ch: The channel object.
        method: The method frame.
        properties: The properties.
        body: The body of the message, which contains JSON with UUID and image data.
    Processes the received image by decoding it, converting it to a data URL,
    and then processing it further. The result is then sent to a queue.
    """
    message = json.loads(body)
    data = message.get("data")
    image_uuid = data.get("uuid")
    base64_image = data.get("image_base64")

    try:
        image_data = decode_image_from_message(base64_image)
        data_url = convert_image_to_data_url(image_data)

        serializable_event = process_image(data_url, image_uuid, SAVE_ANALYZATION_RESULT_PATTERN)
        logger.info("Image with UUID: %s processed successfully.", image_uuid)

        send_event_to_queue(serializable_event)
        logger.info(f"JSON event sent to queue '{SEND_QUEUE_NAME}'.")
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        event = {
            "status": "error",
            "message": "Invalid message format: Missing UUID or image data.",
            "error_details": str(e),
        }
        send_event_to_queue(event)


def send_event_to_queue(event: dict[str, Any]) -> None:
    """Send the processed JSON event to a RabbitMQ queue."""
    # Convert event to a JSON string
    event_json = json.dumps(event)

    # Connect to RabbitMQ
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
    parameters = pika.ConnectionParameters(RABBITMQ_URI, 5672, "/", credentials)
    connection = pika.BlockingConnection(parameters)

    channel = connection.channel()

    # Decalre queue
    channel.queue_declare(queue=SEND_QUEUE_NAME)

    # Send JSON-Event to Queue
    channel.basic_publish(exchange="", routing_key=SEND_QUEUE_NAME, body=event_json)
    logger.info(f"JSON event sent to queue '{SEND_QUEUE_NAME}'.")

    # Close connection
    connection.close()


def main() -> None:
    """Start the RabbitMQ receiver and listen for messages."""
    load_dotenv()
    receiver = RabbitMQReceiver(
        queue_name=RECEIVE_QUEUE_NAME,
        uri=str(RABBITMQ_URI),
        username=str(RABBITMQ_USER),
        password=str(RABBITMQ_PASSWORD),
    )
    try:
        logger.info(f"Listening for messages on queue '{RECEIVE_QUEUE_NAME}'...")
        receiver.start_listening(
            on_image_received  # type: ignore[arg-type]
        )
    except KeyboardInterrupt:
        logger.info("Stopping Document Analyzation Service...")
        receiver.stop()


if __name__ == "__main__":
    main()
