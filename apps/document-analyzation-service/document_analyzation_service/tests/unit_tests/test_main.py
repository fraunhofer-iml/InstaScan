# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0
import json
import unittest
from unittest.mock import MagicMock, patch

from document_analyzation_service.main import (
    SAVE_ANALYZATION_RESULT_PATTERN,
    SEND_QUEUE_NAME,
    on_image_received,
    send_event_to_queue,
)


class TestOnImageReceived(unittest.TestCase):
    @patch("document_analyzation_service.main.decode_image_from_message")
    @patch("document_analyzation_service.main.convert_image_to_data_url")
    @patch("document_analyzation_service.main.process_image")
    @patch("document_analyzation_service.main.send_event_to_queue")
    def test_on_image_received_valid_message(
        self,
        mock_send_event_to_queue,
        mock_process_image,
        mock_convert_image_to_data_url,
        mock_decode_image_from_message,
    ):
        ch = MagicMock()
        method = MagicMock()
        properties = MagicMock()
        body = json.dumps(
            {"data": {"uuid": "1234", "image_base64": "some_base64_encoded_string"}}
        ).encode("utf-8")
        mock_decode_image_from_message.return_value = "decoded_image_data"
        mock_convert_image_to_data_url.return_value = "data_url"
        mock_process_image.return_value = {"processed": "data"}

        on_image_received(ch, method, properties, body)

        mock_decode_image_from_message.assert_called_once_with("some_base64_encoded_string")
        mock_convert_image_to_data_url.assert_called_once_with("decoded_image_data")
        mock_process_image.assert_called_once_with(
            "data_url", "1234", SAVE_ANALYZATION_RESULT_PATTERN
        )
        mock_send_event_to_queue.assert_called_once_with({"processed": "data"})

    @patch("document_analyzation_service.main.logger")
    @patch("document_analyzation_service.main.send_event_to_queue")
    @patch("document_analyzation_service.main.process_image")
    @patch("document_analyzation_service.main.convert_image_to_data_url")
    @patch("document_analyzation_service.main.decode_image_from_message")
    def test_successful_processing_logs_and_calls(
        self,
        mock_decode,
        mock_convert,
        mock_process,
        mock_send_event,
        mock_logger,
    ):
        uuid = "test-uuid-123"
        base64_image = "base64string"
        event_result = {"result": "some data"}

        mock_decode.return_value = b"decoded_image_bytes"
        mock_convert.return_value = "data_url_string"
        mock_process.return_value = event_result

        body = json.dumps({"data": {"uuid": uuid, "image_base64": base64_image}}).encode("utf-8")

        on_image_received(MagicMock(), MagicMock(), MagicMock(), body)

        mock_decode.assert_called_once_with(base64_image)
        mock_convert.assert_called_once_with(b"decoded_image_bytes")
        mock_process.assert_called_once_with(
            "data_url_string", uuid, SAVE_ANALYZATION_RESULT_PATTERN
        )
        mock_send_event.assert_called_once_with(event_result)
        mock_logger.info.assert_any_call("Image with UUID: %s processed successfully.", uuid)
        mock_logger.info.assert_any_call(f"JSON event sent to queue '{SEND_QUEUE_NAME}'.")

    @patch("document_analyzation_service.main.logger")
    @patch("document_analyzation_service.main.send_event_to_queue")
    @patch("document_analyzation_service.main.decode_image_from_message")
    def test_processing_exception_triggers_error_event(
        self,
        mock_decode,
        mock_send_event,
        mock_logger,
    ):
        uuid = "test-uuid-456"
        base64_image = "base64string"

        mock_decode.side_effect = Exception("Decode failure")

        body = json.dumps({"data": {"uuid": uuid, "image_base64": base64_image}}).encode("utf-8")

        on_image_received(MagicMock(), MagicMock(), MagicMock(), body)

        mock_decode.assert_called_once_with(base64_image)
        mock_logger.error.assert_called()
        error_msg = mock_logger.error.call_args[0][0]
        self.assertIn("Error processing message", error_msg)

        called_event = mock_send_event.call_args[0][0]
        self.assertIn("error_details", called_event)
        self.assertIn("Decode failure", called_event["error_details"])

    @patch("document_analyzation_service.main.send_event_to_queue")
    def test_on_image_received_invalid_json(self, mock_send_event_to_queue):
        ch = MagicMock()
        method = MagicMock()
        properties = MagicMock()
        body = "invalid_json".encode("utf-8")

        with self.assertRaises(json.JSONDecodeError):
            on_image_received(ch, method, properties, body)

        mock_send_event_to_queue.assert_not_called()

    @patch("document_analyzation_service.main.send_event_to_queue")
    def test_on_image_received_missing_uuid_or_image(self, mock_send_event_to_queue):
        ch = MagicMock()
        method = MagicMock()
        properties = MagicMock()

        # Fehlende 'uuid'
        body1 = json.dumps({"data": {"image_base64": "something"}}).encode("utf-8")
        on_image_received(ch, method, properties, body1)
        mock_send_event_to_queue.assert_called()
        called_event1 = mock_send_event_to_queue.call_args_list[-1][0][0]
        assert called_event1.get("status") == "error"

        mock_send_event_to_queue.reset_mock()

        # Fehlende 'image_base64'
        body2 = json.dumps({"data": {"uuid": "1234"}}).encode("utf-8")
        on_image_received(ch, method, properties, body2)
        mock_send_event_to_queue.assert_called()
        called_event2 = mock_send_event_to_queue.call_args_list[-1][0][0]
        assert called_event2.get("status") == "error"

    @patch("document_analyzation_service.main.send_event_to_queue")
    @patch("document_analyzation_service.main.process_image")
    @patch("document_analyzation_service.main.convert_image_to_data_url")
    @patch("document_analyzation_service.main.decode_image_from_message")
    @patch("document_analyzation_service.main.logger")
    def test_on_image_received_success(
        self, mock_logger, mock_decode, mock_convert, mock_process, mock_send_event
    ):
        # Arrange
        uuid = "test-uuid"
        base64_img = "base64string"
        event_result = {"result": "processed data"}

        mock_decode.return_value = b"decoded_bytes"
        mock_convert.return_value = "data_url_string"
        mock_process.return_value = event_result

        message = {"data": {"uuid": uuid, "image_base64": base64_img}}
        body = json.dumps(message).encode("utf-8")

        # Act
        on_image_received(MagicMock(), MagicMock(), MagicMock(), body)

        # Assert that all functions are called correctly
        mock_decode.assert_called_once_with(base64_img)
        mock_convert.assert_called_once_with(b"decoded_bytes")
        mock_process.assert_called_once_with(
            "data_url_string", uuid, SAVE_ANALYZATION_RESULT_PATTERN
        )
        mock_send_event.assert_called_once_with(event_result)

        # Assert logger info calls
        mock_logger.info.assert_any_call("Image with UUID: %s processed successfully.", uuid)
        mock_logger.info.assert_any_call(f"JSON event sent to queue '{SEND_QUEUE_NAME}'.")

    @patch("document_analyzation_service.main.send_event_to_queue")
    @patch("document_analyzation_service.main.logger")
    def test_on_image_received_exception(self, mock_logger, mock_send_event):
        # Arrange: simulate missing uuid or base64 triggering an exception in decode_image_from_message
        message = {"data": {"uuid": None, "image_base64": None}}  # or simply invalid
        body = json.dumps(message).encode("utf-8")

        # Act
        on_image_received(MagicMock(), MagicMock(), MagicMock(), body)

        # Assert logger error called with expected message
        mock_logger.error.assert_called_once()
        error_message = mock_logger.error.call_args[0][0]
        self.assertIn("Error processing message", error_message)

        # Assert send_event_to_queue called with error event
        call_args = mock_send_event.call_args[0][0]
        self.assertEqual(call_args["status"], "error")
        self.assertIn("Invalid message format", call_args["message"])


class TestMainFunction(unittest.TestCase):
    @patch("document_analyzation_service.main.RabbitMQReceiver")
    @patch("document_analyzation_service.main.load_dotenv")
    def test_main_runs_without_error(self, mock_load_dotenv, mock_receiver):
        mock_receiver.return_value.start_listening.side_effect = KeyboardInterrupt
        mock_receiver.return_value.stop = MagicMock()

        from document_analyzation_service.main import main

        main()

        mock_load_dotenv.assert_called_once()
        mock_receiver.return_value.start_listening.assert_called_once()
        mock_receiver.return_value.stop.assert_called_once()


class TestSendEventToQueue(unittest.TestCase):
    @patch("pika.BlockingConnection")
    @patch("pika.ConnectionParameters")
    @patch("pika.PlainCredentials")
    def test_send_event_to_queue(
        self, mock_plain_credentials, mock_connection_parameters, mock_blocking_connection
    ):
        event = {"processed": "data"}
        send_event_to_queue(event)
        mock_blocking_connection.assert_called_once()
        mock_connection_parameters.assert_called_once()
        mock_plain_credentials.assert_called_once()


if __name__ == "__main__":
    unittest.main()
