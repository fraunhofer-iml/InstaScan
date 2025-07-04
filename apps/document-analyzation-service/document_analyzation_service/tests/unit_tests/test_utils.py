# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

import base64
import io
import unittest
from unittest import mock

import pytest
from PIL import Image

from document_analyzation_service.utils import (
    image_to_data_url,
    local_image_to_data_url,
    make_serializable,
)


def test_local_image_to_data_url_with_valid_image():
    image_path = "test_image.jpg"
    mime_type = "image/jpeg"
    image_content = b"test image content"
    base64_encoded_data = base64.b64encode(image_content).decode("utf-8")
    expected_data_url = f"data:{mime_type};base64,{base64_encoded_data}"

    with (
        mock.patch("builtins.open", mock.mock_open(read_data=image_content)),
        mock.patch("mimetypes.guess_type", return_value=(mime_type, None)),
    ):
        assert local_image_to_data_url(image_path) == expected_data_url


def test_local_image_to_data_url_with_unknown_mime_type():
    image_path = "test_image.unknown"
    mime_type = "application/octet-stream"
    image_content = b"test image content"
    base64_encoded_data = base64.b64encode(image_content).decode("utf-8")
    expected_data_url = f"data:{mime_type};base64,{base64_encoded_data}"

    with (
        mock.patch("builtins.open", mock.mock_open(read_data=image_content)),
        mock.patch("mimetypes.guess_type", return_value=(None, None)),
    ):
        assert local_image_to_data_url(image_path) == expected_data_url


def test_local_image_to_data_url_with_nonexistent_file():
    image_path = "nonexistent_image.jpg"

    with pytest.raises(FileNotFoundError):
        local_image_to_data_url(image_path)


def test_image_to_data_url_with_valid_image():
    image = Image.new("RGB", (10, 10), color="red")
    mime_type = "image/jpeg"
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    base64_encoded_data = base64.b64encode(buffered.getvalue()).decode("utf-8")
    expected_data_url = f"data:{mime_type};base64,{base64_encoded_data}"

    expected = expected_data_url.split(",")[1]
    actual = image_to_data_url(image).split(",")[1]
    assert expected == actual


def test_image_to_data_url_with_unknown_format():
    image = Image.new("RGB", (10, 10), color="red")
    image.format = None
    mime_type = "application/octet-stream"
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    base64_encoded_data = base64.b64encode(buffered.getvalue()).decode("utf-8")
    expected_data_url = f"data:{mime_type};base64,{base64_encoded_data}"

    assert image_to_data_url(image) == expected_data_url


def test_make_serializable_with_dict():
    obj = {"key": "value"}
    assert make_serializable(obj) == obj


def test_make_serializable_with_list():
    obj = ["value1", "value2"]
    assert make_serializable(obj) == obj


def test_make_serializable_with_custom_object():
    class CustomObject:
        def __init__(self):
            self.attr = "value"

    obj = CustomObject()
    expected_serialized = {"attr": "value"}
    assert make_serializable(obj) == expected_serialized


def test_make_serializable_with_to_dict_method():
    class CustomObject:
        def to_dict(self):
            return {"attr": "value"}

    obj = CustomObject()
    expected_serialized = {"attr": "value"}
    assert make_serializable(obj) == expected_serialized


def test_make_serializable_with_primitive():
    obj = 42
    assert make_serializable(obj) == obj


# def test_make_serializable_with_unknown_type():
#    class CustomObject:
#        pass
#
#    obj = CustomObject()
#    assert make_serializable(obj) == str(obj)

if __name__ == "__main__":
    unittest.main()
