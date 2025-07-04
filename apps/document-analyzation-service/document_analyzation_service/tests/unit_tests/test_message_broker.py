# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

import base64
import unittest
from unittest.mock import MagicMock, patch

import pika

from document_analyzation_service.message_broker import RabbitMQReceiver, decode_image_from_message


class TestRabbitMQReceiver(unittest.TestCase):
    @patch("document_analyzation_service.message_broker.pika.BlockingConnection")
    @patch("document_analyzation_service.message_broker.pika.ConnectionParameters")
    @patch("document_analyzation_service.message_broker.pika.PlainCredentials")
    def setUp(self, mock_credentials, mock_parameters, mock_connection):
        self.queue_name = "test_queue"
        self.uri = "localhost"
        self.username = "guest"
        self.password = "guest"

        self.mock_connection = mock_connection.return_value
        self.mock_channel = self.mock_connection.channel.return_value

        self.receiver = RabbitMQReceiver(self.queue_name, self.uri, self.username, self.password)

    @patch("document_analyzation_service.message_broker.time.sleep", return_value=None)
    def test_connect_failure(self, mock_sleep):
        self.mock_connection.side_effect = pika.exceptions.AMQPConnectionError
        with self.assertRaises(Exception) as context:
            self.receiver.connect()
            self.assertIn(
                "ERROR: Failed to connect to RabbitMQ after multiple retries",
                str(context.exception),
            )

    def test_start_listening(self):
        callback = MagicMock()
        self.receiver.start_listening(callback)
        self.mock_channel.basic_consume.assert_called_once_with(
            queue=self.queue_name, on_message_callback=callback, auto_ack=True
        )
        self.mock_channel.start_consuming.assert_called_once()

    def test_stop(self):
        self.receiver.stop()
        self.mock_connection.close.assert_called_once()


class TestDecodeImageFromMessage(unittest.TestCase):
    def test_decode_image_from_message(self):
        message_body = base64.b64encode(b"test_image_data")
        decoded_image = decode_image_from_message(message_body)
        self.assertEqual(decoded_image, b"test_image_data")


if __name__ == "__main__":
    unittest.main()
