# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

"""This module uses the functions for classifying documents and consolidates their results."""

import logging
from PIL import Image
import base64
from io import BytesIO
from doctr.models import ocr_predictor
import numpy as np

from document_analyzation_service.document_classification.document_class_identifier.document_type_identifier_list import (
    document_type_identifier_list,
)

logger = logging.getLogger(__name__)

model = ocr_predictor(pretrained=True)


def calculate_doc_type_score(ocr_text: str, doc_type_identifier: list[str]) -> float:
    """Calculate the similarity score for a document type."""
    similarity_score = 0

    for identifier in doc_type_identifier:
        if identifier.lower() in ocr_text.lower():
            similarity_score = similarity_score + 1

    return similarity_score / len(doc_type_identifier) if len(doc_type_identifier) > 0 else 0


def calculate_best_doc_type_fit(doctr_ocr_text: str) -> str:
    """Return the document type with the best similarity score. This function calculates the two key figures document_identifier_score and document_main_identifier_score. The document_identifier_score is the set of typical identifiers of a document type that occur in the OCR text. This value is multiplied by the key figure document_main_identifier_score, which is a value of 1 or 0.1, depending on whether a predefined main_identifier was found in the OCR text. The main_identifier is the name of the document type that is explicitly specified on the document."""
    most_suitable_doc_type = ""
    most_suitable_doc_type_score: float = 0

    for doc_type_identifier in document_type_identifier_list:
        document_identifier_score: float = calculate_doc_type_score(
            doctr_ocr_text, doc_type_identifier.characteristic_identifier
        )
        document_main_identifier_score = (
            1 if doc_type_identifier.main_identifier.lower() in doctr_ocr_text.lower() else 0.1
        )
        score = document_identifier_score * document_main_identifier_score

        if most_suitable_doc_type_score < score:
            most_suitable_doc_type = doc_type_identifier.name
            most_suitable_doc_type_score = score

    logger.debug(
        f"The best fitting doc type is {most_suitable_doc_type} with a similarity of {most_suitable_doc_type_score}"
    )

    return most_suitable_doc_type


def create_doctr_ocr(base64_image_string: str) -> str:
    """Return the text found in the image provided."""
    image_data = base64.b64decode(base64_image_string)
    converted_image = Image.open(BytesIO(image_data)).convert("RGB")
    numpy_image = np.array(converted_image)
    ocr_text: str = model([numpy_image]).render()
    return ocr_text


def get_document_class(base64_image_string: str) -> str:
    """Return the document class that best fits an image."""
    doctr_text = create_doctr_ocr(base64_image_string)
    return calculate_best_doc_type_fit(doctr_text)
