# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

"""This module provides utility functions for image processing and serialization."""

import os
from mimetypes import guess_type
import base64
import io
from pathlib import Path
from typing import AnyStr
from PIL.Image import Image


def local_image_to_data_url(image_path: str) -> str:
    """Convert a local image file to a data URL.

    Args:
        image_path (str): The path to the local image file.

    Returns:
        str: The data URL of the image.
    """
    # Guess the MIME type of the image based on the file extension
    mime_type, _ = guess_type(image_path)
    if mime_type is None:
        mime_type = "application/octet-stream"  # Default MIME type if none is found

    # Read and encode the image file
    with open(image_path, "rb") as image_file:
        base64_encoded_data = base64.b64encode(image_file.read()).decode("utf-8")

    # Construct the data URL
    return f"data:{mime_type};base64,{base64_encoded_data}"


def image_to_data_url(image: Image) -> str:
    """Konvertiert ein PIL.Image-Objekt in eine Data-URL."""
    # MIME-Typ anhand des Bildformats bestimmen
    mime_type = f"image/{image.format.lower()}" if image.format else "application/octet-stream"

    # Bild in einen BytesIO-Stream schreiben und als Base64 kodieren
    buffered = io.BytesIO()
    image.save(
        buffered, format=image.format or "JPEG"
    )  # Standardmäßig JPEG, falls Format unbekannt
    base64_encoded_data = base64.b64encode(buffered.getvalue()).decode("utf-8")

    # Data-URL erstellen
    return f"data:{mime_type};base64,{base64_encoded_data}"


def make_serializable(obj: object) -> object:
    """Recursively converts an object into a serializable format.

    Args:
        obj (object): The object to be serialized.

    Returns:
        object: The serialized object.
    """
    # If the object has a `to_dict` method, use it
    if hasattr(obj, "to_dict"):
        return make_serializable(obj.to_dict())
    # For objects with `__dict__` (custom classes), convert their attributes
    elif hasattr(obj, "__dict__"):
        return {k: make_serializable(v) for k, v in obj.__dict__.items()}
    # For lists, tuples, or other iterable types, process each item
    elif isinstance(obj, (list, tuple, set)):
        return [make_serializable(item) for item in obj]
    # For dictionaries, process each key-value pair
    elif isinstance(obj, dict):
        return {k: make_serializable(v) for k, v in obj.items()}
    # If the object is a primitive data type or JSON-serializable, return as is
    elif isinstance(obj, (str, int, float, bool, type(None))):
        return obj
    # Fallback for other types (e.g., convert to string)
    else:
        return str(obj)


def get_root_dir(file_path: AnyStr, file_depth: int) -> str:
    """Get root directory i.e. the absolute path of the python backend.

    Args:
        file_path: Path of file for which to get the root dir.
        file_depth: Depth of given file.

    Returns:
        Absolute path of the root directory.
    """
    return str(Path(str(os.path.dirname(file_path))).parents[file_depth])
