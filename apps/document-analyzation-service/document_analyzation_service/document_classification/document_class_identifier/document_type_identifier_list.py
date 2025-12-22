# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

"""This module contains a list of all possible document types and their characteristic fields."""

from document_analyzation_service.document_classification.document_class_identifier.pallet_note_identifier import (
    pallet_note_identifier,
)
from document_analyzation_service.document_classification.document_class_identifier.soc_cmr_identifier import (
    soc_cmr_identifier,
)
from document_analyzation_service.document_classification.document_class_identifier.syntetic_cmr_identifier import (
    syntetic_cmr_identifier,
)
from document_analyzation_service.document_classification.document_class_identifier.delivery_note_identifier import (
    delivery_note_identifier,
)

document_type_identifier_list = [
    pallet_note_identifier,
    soc_cmr_identifier,
    syntetic_cmr_identifier,
    delivery_note_identifier,
]
