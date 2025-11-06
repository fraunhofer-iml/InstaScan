# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

"""Schema definitions for Pallet Note documents."""

from typing import List

from pydantic import BaseModel, Field

# mypy: disable-error-code=arg-type


class CustomEstablished(BaseModel):
    """Model representing custom establishment details."""

    customEstablishedDate: str = Field(..., description="Custom established date")
    customEstablishedIn: str = Field(..., description="Location of establishment")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class LoadCarrierPackageCount(BaseModel):
    """Model representing the quantity of logistics packages."""

    logisticsPackageItemQuantity: int = Field(
        ..., description="Number of load carriers (packages)"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class MethodOfPacking(BaseModel):
    """Model representing the method of packing."""

    logisticsPackageType: str = Field(..., description="Type of packing method")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class LoadCarrierEntry(BaseModel):
    """Model representing a load carrier entry."""

    methodOfPacking: MethodOfPacking = Field(..., description="Method of packing")
    numberOfPackagesTransferredByCarrier: LoadCarrierPackageCount = Field(
        ..., description="Packages transferred by carrier"
    )
    numberOfPackagesTransferredByConsignee: LoadCarrierPackageCount = Field(
        ..., description="Packages transferred by consignee"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class Signature(BaseModel):
    """Model representing a signature."""

    type: str = Field(..., description="Type of signature")
    userName: str = Field(..., description="Name of the user")
    userCompany: str = Field(..., description="Company of the user")
    userStreet: str = Field(..., description="Street address of the user")
    userPostCode: str = Field(..., description="Postal code of the user")
    userCity: str = Field(..., description="City of the user")
    userCountry: str = Field(..., description="Country of the user")
    date: str = Field(..., description="Date of the signature")
    time: str = Field(..., description="Time of the signature")
    data: str = Field(..., description="Signature data")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class GoodsReceived(BaseModel):
    """Model representing goods received confirmation."""

    consigneeSignature: Signature = Field(..., description="Consignee signature")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class CountryCode(BaseModel):
    """Model representing a country code and its region."""

    region: str = Field(..., description="Region of the country")
    value: str = Field(..., description="Country code")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class ContactInformation(BaseModel):
    """Model representing contact information."""

    email: str = Field(..., description="Contact email")
    phone: str = Field(..., description="Contact phone number")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class SenderInformation(BaseModel):
    """Model representing sender information."""

    senderNameCompany: str = Field(..., description="Sender company name")
    senderNamePerson: str = Field(..., description="Sender person name")
    senderStreet: str = Field(..., description="Sender street address")
    senderPostcode: str = Field(..., description="Sender postal code")
    senderCity: str = Field(..., description="Sender city")
    senderCountryCode: CountryCode = Field(..., description="Sender country code")
    senderContactInformation: ContactInformation = Field(
        ..., description="Sender contact information"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class CarrierInformation(BaseModel):
    """Model representing carrier information."""

    carrierNameCompany: str = Field(..., description="Carrier company name")
    carrierNamePerson: str = Field(..., description="Carrier person name")
    carrierStreet: str = Field(..., description="Carrier street address")
    carrierPostcode: str = Field(..., description="Carrier postal code")
    carrierCity: str = Field(..., description="Carrier city")
    carrierLicensePlate: str = Field(..., description="Carrier license plate")
    carrierCountryCode: CountryCode = Field(..., description="Carrier country code")
    carrierContactInformation: ContactInformation = Field(
        ..., description="Carrier contact information"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class ConsigneeInformation(BaseModel):
    """Model representing consignee information."""

    consigneeNameCompany: str = Field(..., description="Consignee company name")
    consigneeNamePerson: str = Field(..., description="Consignee person name")
    consigneeStreet: str = Field(..., description="Consignee street address")
    consigneePostcode: str = Field(..., description="Consignee postal code")
    consigneeCity: str = Field(..., description="Consignee city")
    consigneeCountryCode: CountryCode = Field(..., description="Consignee country code")
    consigneeContactInformation: ContactInformation = Field(
        ..., description="Consignee contact information"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class OtherUsefulParticulars(BaseModel):
    """Model representing other useful particulars."""

    customParticulars: str = Field(..., description="Custom particulars")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class CarrierSignatureWrapper(BaseModel):
    """Model representing a carrier signature wrapper."""

    carrierSignature: Signature = Field(..., description="Carrier signature")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class PalletNoteDocument(BaseModel):
    """Model representing a pallet note document."""

    referenceIdentificationNumber: str = Field(..., description="Reference identification number")
    established: CustomEstablished = Field(..., description="Establishment information")
    senderInformation: SenderInformation = Field(..., description="Information about the sender")
    carrierInformation: CarrierInformation = Field(
        ..., description="Information about the carrier"
    )
    consigneeInformation: ConsigneeInformation = Field(
        ..., description="Information about the consignee"
    )
    loadCarrierList: List[LoadCarrierEntry] = Field(
        default_factory=list, description="List of load carriers"
    )
    otherUsefulParticulars: OtherUsefulParticulars = Field(
        ..., description="Other useful particulars"
    )
    goodsReceived: GoodsReceived = Field(..., description="Goods received confirmation")
    signatureOrStampOfTheCarrier: CarrierSignatureWrapper = Field(
        ..., description="Carrier signature or stamp"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"
