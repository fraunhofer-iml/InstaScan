# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

import io
import unittest
from unittest.mock import MagicMock, patch

from PIL import Image

from document_analyzation_service.image_processor import (
    convert_image_to_data_url,
    process_image,
    process_image_with_azure,
    retrieve_document_data,
)


class TestImageProcessor(unittest.TestCase):
    def test_convert_image_to_data_url(self):
        img = Image.new("RGB", (1, 1), color="white")
        byte_io = io.BytesIO()
        img.save(byte_io, format="PNG")
        byte_io.seek(0)

        data_url = convert_image_to_data_url(byte_io.read())
        self.assertTrue(data_url.startswith("data:image/png;base64,"))

    @patch("document_analyzation_service.image_processor.time.sleep", return_value=None)
    @patch(
        "document_analyzation_service.image_processor.process_image_with_azure",
        side_effect=Exception("fail"),
    )
    def test_process_image_failure_handling(self, mock_process, mock_sleep):
        result = process_image("dummy_url", "uuid123", "pattern")

        self.assertEqual(result["data"]["image_analysis_result"]["status"], "error")
        self.assertIn("error_details", result["data"]["image_analysis_result"])
        self.assertEqual(mock_process.call_count, 2)
        self.assertEqual(mock_sleep.call_count, 2)

    @patch("document_analyzation_service.image_processor.AzureOpenAI")
    @patch("document_analyzation_service.image_processor.retrieve_document_data")
    def test_process_image_with_azure(self, mock_retrieve, mock_client_class):
        mock_client = MagicMock()
        mock_client_class.return_value = mock_client
        mock_completion = MagicMock()
        mock_completion.choices = [MagicMock(message=MagicMock(parsed={"field": "value"}))]
        mock_retrieve.return_value = mock_completion

        result = process_image_with_azure("some_data_url")

        self.assertEqual(result, {"field": "value"})
        mock_client_class.assert_called_once()
        mock_retrieve.assert_called_once_with("some_data_url", mock_client)

    def test_retrieve_document_data(self):
        mock_client = MagicMock()
        mock_completion = MagicMock()
        mock_client.beta.chat.completions.parse.return_value = mock_completion

        result = retrieve_document_data("dummy_url", mock_client)

        self.assertEqual(result, mock_completion)
        mock_client.beta.chat.completions.parse.assert_called_once()

    @patch("document_analyzation_service.image_processor.process_image_with_azure")
    def test_process_image_valid_data_url(self, mock_process_image_with_azure):
        data_url = "data:image/png;base64,testdata"
        image_uuid = "1234"
        mock_process_image_with_azure.return_value = {
            "status": "success",
            "data": "processed_data",
        }

        result = process_image(data_url, image_uuid, "test_message_pattern")

        self.assertEqual(result["data"]["uuid"], image_uuid)
        self.assertEqual(result["data"]["image_analysis_result"]["status"], "success")
        self.assertEqual(result["data"]["image_analysis_result"]["data"], "processed_data")

    @patch("document_analyzation_service.image_processor.process_image_with_azure")
    def test_process_image_azure_error(self, mock_process_image_with_azure):
        data_url = "data:image/png;base64,testdata"
        image_uuid = "1234"
        mock_process_image_with_azure.side_effect = Exception("401 Unauthorized")

        result = process_image(data_url, image_uuid, "test_message_pattern")

        self.assertEqual(result["data"]["image_analysis_result"]["status"], "error")
        self.assertIn(
            "Azure Environment file not adjusted",
            result["data"]["image_analysis_result"]["message"],
        )

    @patch("document_analyzation_service.image_processor.time.sleep", return_value=None)
    @patch("document_analyzation_service.image_processor.process_image_with_azure")
    def test_process_image_with_retry(self, mock_process, mock_sleep):
        mock_process.side_effect = [Exception("Temporary error"), {"some": "result"}]

        result = process_image("dummy_url", "uuid123", "pattern")

        self.assertEqual(result["data"]["image_analysis_result"], {"some": "result"})
        self.assertEqual(mock_process.call_count, 2)
        mock_sleep.assert_called_once()


if __name__ == "__main__":
    unittest.main()
