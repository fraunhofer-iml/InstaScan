# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

"""This module defines which fields are characteristic of a soc CMR."""

from document_analyzation_service.document_classification.document_class_identifier.document_type_identifier_dto import (
    DocumentTypeIdentifierDto,
)

soc_cmr_identifier = DocumentTypeIdentifierDto(
    "soc_cmr",
    "cmr",
    [
        "absender",
        "empfänger",
        "auslieferungsort des gutes",
        "ort und tag der übernahme des gutes",
        "beigefügte dokumente",
        "kennzeichen und nummer",
        "anzahl der packstücke",
        "art der verpackung",
        "bezeichnung des gutes",
        "statistiknummer",
        "bruttogewicht in kg",
        "umfang in m3",
        "anweisungen des absenders",
        "frachtzahlungsanweisungen",
        "frachtführer",
        "ausführender frachtführer",
        "vorbehalte und bemerkungen des frachtführers",
        "besondere vereinbarungen",
        "ausgefertigt in",
        "unterschrift und stempel des absenders",
        "unterschrift und stempel des frachtführers",
        "unterschrift und stempel des empfängers",
        "sender",
        "consignee",
        "place of delivery of goods",
        "place of date of loading of goods",
        "documents attached",
        "signo",
        "quantity",
        "packing",
        "nature of goods",
        "statistics number",
        "gross kg",
        "cubage m3",
        "senders instruction",
        "instruction as to payment for carriage",
        "carrier",
        "the following freight carrier",
        "carriers reservations and observations",
        "established in",
        "signature and stamp of sender",
        "signature and stamp of carrier",
        "signature and stamps of receiver",
    ],
)
