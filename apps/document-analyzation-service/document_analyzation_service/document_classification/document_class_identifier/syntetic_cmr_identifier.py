# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

"""This module defines which fields are characteristic of a synthetic CMR."""

from document_analyzation_service.document_classification.document_class_identifier.document_type_identifier_dto import (
    DocumentTypeIdentifierDto,
)

syntetic_cmr_identifier = DocumentTypeIdentifierDto(
    "syntetic_cmr",
    "cmr",
    [
        "sender",
        "consignee",
        "taking over the goods",
        "delivery of the goods",
        "senders instruction",
        "carrier",
        "successive carriers",
        "carriers reservation and observation on taking over the goods",
        "documents handed to the carrier by the sender",
        "marks and nos",
        "number of packages",
        "method of packing",
        "nature of the goods",
        "gross weight in kg",
        "volume in m3",
        "special agreements between the sender and the carrier",
        "a payer par to be paid by",
        "other useful particulars",
        "cash on delivery",
        "established in",
        "signature or stamp of the sender",
        "signature or stamp of the carrier",
        "signature and stamp of the consignee",
    ],
)
