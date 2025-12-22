# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

"""This module defines the DTO class, which can be used to specify which fields are characteristic of certain document types."""


class DocumentTypeIdentifierDto:
    """This dto class specifies the structure for specifying the characteristic fields."""

    name: str
    main_identifier: str
    characteristic_identifier: list[str] = []

    def __init__(
        self,
        name: str,
        main_identifier: str,
        characteristic_identifier: list[str],
    ):
        """Define characteristic fields of a document type."""
        self.name = name
        self.main_identifier = main_identifier
        self.characteristic_identifier = characteristic_identifier

    def __str__(self) -> str:
        """Specify a string representation of the characteristic fields of a document type."""
        return (
            f"doc_type: {self.name}\ncharacteristic identifier: {self.characteristic_identifier}"
        )
