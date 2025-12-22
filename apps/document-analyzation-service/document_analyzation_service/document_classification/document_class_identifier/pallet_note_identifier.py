# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

"""This module defines which fields are characteristic of a pallet note."""

from document_analyzation_service.document_classification.document_class_identifier.document_type_identifier_dto import (
    DocumentTypeIdentifierDto,
)

pallet_note_identifier = DocumentTypeIdentifierDto(
    "pallet_note",
    "Palettenschein",
    [
        "absender",
        "empfänger",
        "spedition",
        "absender übergibt",
        "euroflachpaletten",
        "eurogitterboxpaletten",
        "absender erhält",
    ],
)
