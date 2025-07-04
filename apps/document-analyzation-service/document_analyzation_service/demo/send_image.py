# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

"""This module provides functionality to send an image to a RabbitMQ queue after encoding it in Base64 format."""

import base64
import json
import logging
import os
import uuid

import pika

from document_analyzation_service.utils import get_root_dir

# RabbitMQ-parameter
AMQP_QUEUE_PREFIX = os.getenv("AMQP_QUEUE_PREFIX", "auavp-dev-")
QUEUE_NAME = AMQP_QUEUE_PREFIX + "SKALA_AP4_DAS_QUEUE"
RABBITMQ_URI = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_USER = os.getenv("RABBITMQ_USER")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD")


def send_image_to_queue(image_path: str) -> None:
    """Send an image to the RabbitMQ queue after encoding it in Base64.

    Args:
        image_path (str): The file path of the image to be sent.
    """
    # Create UUID
    image_uuid = str(uuid.uuid4())

    # read the image and encode it in Base64
    with open(image_path, "rb") as image_file:
        image_data = image_file.read()
        base64_encoded_image = base64.b64encode(image_data).decode("utf-8")

    message = {"data": {"uuid": image_uuid, "image_base64": base64_encoded_image}}
    message_json = json.dumps(message)

    # Connect to RabbitMQ
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
    parameters = pika.ConnectionParameters(RABBITMQ_URI, 5672, "/", credentials)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    # Declare Queue
    channel.queue_declare(queue=QUEUE_NAME)

    # Send base64 encoded image as message to the queue
    channel.basic_publish(exchange="", routing_key=QUEUE_NAME, body=message_json)

    logging.info("Sent image to queue '%s'.", QUEUE_NAME)
    logging.info("Image UUID: %s", image_uuid)

    connection.close()


if __name__ == "__main__":
    # Send example image
    send_image_to_queue(
        os.path.join(
            get_root_dir(file_path=os.path.realpath(__file__), file_depth=1),
            "document_analyzation_service/imgs/1475095_0.jpg",
        )
    )
