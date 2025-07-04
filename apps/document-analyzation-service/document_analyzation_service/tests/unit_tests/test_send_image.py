# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

import base64
import json
import unittest
import uuid
from unittest import mock
from unittest.mock import MagicMock, patch

from document_analyzation_service.demo.send_image import send_image_to_queue


class TestSendImageToQueue(unittest.TestCase):
    @patch("document_analyzation_service.demo.send_image.pika.BlockingConnection")
    @patch("document_analyzation_service.demo.send_image.pika.ConnectionParameters")
    @patch("document_analyzation_service.demo.send_image.pika.PlainCredentials")
    @patch("builtins.open", new_callable=mock.mock_open)
    @patch(
        "document_analyzation_service.demo.send_image.uuid.uuid4",
        return_value=uuid.UUID("12345678123456781234567812345678"),
    )
    def test_send_image_to_queue(
        self, mock_uuid, mock_open, mock_credentials, mock_parameters, mock_connection
    ):
        # make read() return bytes (important for binary file read)
        mock_open.return_value.read.return_value = b"test_image_data"

        mock_channel = MagicMock()
        mock_connection.return_value.channel.return_value = mock_channel

        send_image_to_queue("test_image_path")

        # Checks
        mock_open.assert_called_once_with("test_image_path", "rb")
        mock_open().read.assert_called_once()
        mock_uuid.assert_called_once()

        expected_message = {
            "data": {
                "uuid": "12345678-1234-5678-1234-567812345678",
                "image_base64": base64.b64encode(b"test_image_data").decode("utf-8"),
            }
        }
        expected_message_json = json.dumps(expected_message)

        mock_parameters.assert_called_once_with(
            "localhost", 5672, "/", mock_credentials.return_value
        )
        mock_connection.assert_called_once_with(mock_parameters.return_value)

        mock_channel.queue_declare.assert_called_once_with(queue="auavp-dev-SKALA_AP4_DAS_QUEUE")
        mock_channel.basic_publish.assert_called_once_with(
            exchange="", routing_key="auavp-dev-SKALA_AP4_DAS_QUEUE", body=expected_message_json
        )
        mock_connection.return_value.close.assert_called_once()


if __name__ == "__main__":
    unittest.main()
