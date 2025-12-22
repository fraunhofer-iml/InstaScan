# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

"""This module provides functions to process images and interact with the Azure API to extract document data."""

import io
import logging
import os
import time
from typing import Any

from openai import AzureOpenAI
from openai.types.chat.parsed_chat_completion import ParsedChatCompletion
from PIL import Image

from document_analyzation_service.delivery_note import DeliveryNoteDocument
from document_analyzation_service.ecmr_schema import ECMRDocument
from document_analyzation_service.pallet_note_schema import PalletNoteDocument
from document_analyzation_service.utils import DocumentType, image_to_data_url, make_serializable

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# mypy: disable-error-code=return-value


def convert_image_to_data_url(image_data: bytes) -> str:
    """Convert binary image data to a Data URL.

    Args:
    ----------
    image_data : bytes
        The binary data of the image.

    Returns:
    -------
    str
        The Data URL representation of the image.
    """
    image = Image.open(io.BytesIO(image_data))
    data_url = image_to_data_url(image)
    return data_url


def process_image(
    data_url: str, image_uuid: str, message_pattern: str, document_type: str
) -> dict[str, Any]:
    """Process an image Data URL and extracting document data using Azure API.

    Args:
    ----------
    data_url : str
        The Data URL representation of the image.
    image_uuid : str
        The unique identifier for the image.
    message_pattern : str
        Topic name for sending the result.
    document_type : str
        The type of document to be processed.

    Returns:
    -------
    dict[str, Any]
        The resulting event of the image processing.
    """
    max_attempts = 2
    attempt = 0
    last_exception = None

    while attempt < max_attempts:
        try:
            event = process_image_with_azure(data_url, document_type=document_type)
            break  # Successful processing, exit the loop

        except Exception as e:
            last_exception = e
            if "401" in str(last_exception):
                logger.error("Unauthorized error (401). Azure Environment file not adjusted.")
                event = {
                    "status": "error",
                    "message": "Azure Environment file not adjusted. Please check your .env file configuration for Azure credentials.",
                    "error_details": str(e),
                }
                # No need to retry on authentication error
                break

            logger.warning(f"Attempt {attempt + 1} failed: {str(e)}")
            attempt += 1
            time.sleep(1)  # short delay before retrying
    else:
        # Only executed if the loop was not broken, meaning all attempts failed
        logger.error(f"Error while processing the image: {str(last_exception)}")
        event = {
            "status": "error",
            "message": "An error occurred while processing the image.",
            "error_details": str(last_exception),
        }

    return {
        "pattern": message_pattern,
        "data": {
            "uuid": image_uuid,
            "image_analysis_result": event,
            "document_type": document_type,
        },
    }


def process_image_with_azure(data_url: str, document_type: str) -> object:
    """Communicate with the Azure API to process the image Data URL and return the serialized result.

    Args:
    ----------
    data_url : str
        The Data URL representation of the image.
    document_type : str
        The type of document to be processed.

    Returns:
    -------
    object
        The serialized result from the Azure API.
    """
    client = AzureOpenAI(
        azure_endpoint=str(os.getenv("AZURE_API_ENDPOINT")),
        api_key=os.getenv("AZURE_API_KEY"),
        api_version=os.getenv("API_VERSION"),
    )

    completion = retrieve_document_data(data_url, client, document_type)
    event = completion.choices[0].message.parsed
    return make_serializable(event)


def retrieve_document_data(
    data_url: str, client: AzureOpenAI, document_type: str
) -> ParsedChatCompletion[ECMRDocument | DeliveryNoteDocument | PalletNoteDocument]:
    """Retrieve the document data from the Azure API, by assembling an Open AI message.

    Args:
    ----------
    data_url : str
        The Data URL representation of the image.
    client : AzureOpenAI
        The Azure OpenAI client instance.
    document_type : str
        The type of document to be processed.

    Returns:
    -------
    ParsedChatCompletion[ECMRDocument | DeliveryNoteDocument | PalletNoteDocument]
        The document data retrieved from the Azure API.
    """
    from typing import Type, Union

    response_format: Type[Union[PalletNoteDocument, DeliveryNoteDocument, ECMRDocument]]

    if document_type == DocumentType.PALLET_NOTE.value:
        response_format = PalletNoteDocument
    elif document_type == DocumentType.DELIVERY_NOTE.value:
        response_format = DeliveryNoteDocument
    else:
        response_format = ECMRDocument

    logger.info(
        "Using response_format=%s for document_type=%s", response_format.__name__, document_type
    )

    completion = client.beta.chat.completions.parse(
        model=str(os.getenv("GPT_MODEL")),
        messages=[
            {
                "role": "system",
                "content": "You are a specialist in document digitalization. You know exactly how to extract all relevant information from documents. Information can be machine-written, hand-written or be part of a stamp. You do not conclude information or include it from the context if it is missing.",
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": 'A CMR consists of several fields, give me the information that is written on the document for all of these fields. In other words: Extract all relevant information. If you cannot find a value for a field, fill in this value with an empty string ("").',
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": data_url,
                        },
                    },
                ],
            },
        ],
        response_format=response_format,
    )
    logger.debug("Completion received: %s", completion)
    return completion
