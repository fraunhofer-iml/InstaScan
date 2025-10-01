# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

"""This module defines the data models for ECMR documents using Pydantic."""

from typing import List, Optional

from pydantic import BaseModel, Field

# mypy: disable-error-code=arg-type


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

    senderNameCompany: str = Field(..., description="Sender Company Name")
    senderNamePerson: str = Field(..., description="Sender Person Name")
    senderStreet: str = Field(..., description="Sender Street")
    senderPostcode: str = Field(..., description="Sender Postcode")
    senderCity: str = Field(..., description="Sender City")
    senderCountryCode: CountryCode = Field(
        default_factory=CountryCode, description="Sender Country Code"
    )
    senderContactInformation: ContactInformation = Field(
        default_factory=ContactInformation, description="Sender Contact Information"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class ConsigneeInformation(BaseModel):
    """Model representing consignee information."""

    consigneeNameCompany: str = Field(..., description="Consignee Company Name")
    consigneeNamePerson: str = Field(..., description="Consignee Person Name")
    consigneeStreet: str = Field(..., description="Consignee Street")
    consigneePostcode: str = Field(..., description="Consignee Postcode")
    consigneeCity: str = Field(..., description="Consignee City")
    consigneeCountryCode: CountryCode = Field(
        default_factory=CountryCode, description="Consignee Country Code"
    )
    consigneeContactInformation: ContactInformation = Field(
        default_factory=ContactInformation, description="Consignee Contact Information"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class TakingOverTheGoods(BaseModel):
    """Model representing the details of taking over the goods."""

    takingOverTheGoodsPlace: str = Field(..., description="Place of taking over the goods")
    logisticsDateOfArrival: str = Field(..., description="Date of arrival")
    logisticsTimeOfArrival: str = Field(..., description="Time of arrival")
    logisticsDateOfDeparture: str = Field(..., description="Date of departure")
    logisticsTimeOfDeparture: str = Field(..., description="Time of departure")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class DeliveryOfTheGoods(BaseModel):
    """Model representing the delivery of the goods."""

    logisticsLocationCity: str = Field(..., description="City of logistics location")
    logisticsLocationOpeningHours: str = Field(
        ..., description="Opening hours of logistics location"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class SenderInstructions(BaseModel):
    """Model representing sender instructions."""

    transportInstructionsDescription: str = Field(
        ..., description="Transport Instructions Description"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class CarrierInformation(BaseModel):
    """Model representing carrier information."""

    carrierNameCompany: str = Field(..., description="Carrier Company Name")
    carrierNamePerson: str = Field(..., description="Carrier Person Name")
    carrierStreet: str = Field(..., description="Carrier Street")
    carrierPostcode: str = Field(..., description="Carrier Postcode")
    carrierCity: str = Field(..., description="Carrier City")
    carrierCountryCode: CountryCode = Field(
        default_factory=CountryCode, description="Carrier Country Code"
    )
    carrierLicensePlate: str = Field(..., description="Carrier License Plate")
    carrierContactInformation: ContactInformation = Field(
        default_factory=ContactInformation, description="Carrier Contact Information"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class SuccessiveCarrierInformation(BaseModel):
    """Model representing successive carrier information."""

    successiveCarrierNameCompany: str = Field(..., description="Successive Carrier Company Name")
    successiveCarrierNamePerson: str = Field(..., description="Successive Carrier Person Name")
    successiveCarrierStreet: str = Field(..., description="Successive Carrier Street")
    successiveCarrierPostcode: str = Field(..., description="Successive Carrier Postcode")
    successiveCarrierCity: str = Field(..., description="Successive Carrier City")
    successiveCarrierCountryCode: CountryCode = Field(
        default_factory=CountryCode, description="Successive Carrier Country Code"
    )
    successiveCarrierContactInformation: ContactInformation = Field(
        default_factory=ContactInformation,
        description="Successive Carrier Contact Information",
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class CarrierReservationsAndObservations(BaseModel):
    """Model representing carrier reservations and observations."""

    carrierReservationsObservations: str = Field(
        ..., description="Carrier Reservations Observations"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class DocumentsHandedToCarrier(BaseModel):
    """Model representing documents handed to the carrier."""

    documentsRemarks: str = Field(..., description="Remarks about documents handed to carrier")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class MarksAndNos(BaseModel):
    """Model representing marks and numbers."""

    logisticsShippingMarksMarking: str = Field(..., description="Shipping marks")
    logisticsShippingMarksCustomBarcode: str = Field(..., description="Custom barcode")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class NumberOfPackages(BaseModel):
    """Model representing the number of packages."""

    logisticsPackageItemQuantity: int = Field(0, description="Number of packages")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class MethodOfPacking(BaseModel):
    """Model representing the method of packing."""

    logisticsPackageType: str = Field(..., description="Type of package")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class NatureOfTheGoods(BaseModel):
    """Model representing the nature of the goods."""

    transportCargoIdentification: str = Field(..., description="Cargo identification")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class GrossWeightInKg(BaseModel):
    """Model representing the gross weight in kilograms."""

    supplyChainConsignmentItemGrossWeight: float = Field(0, description="Gross weight in kg")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class VolumeInM3(BaseModel):
    """Model representing the volume in cubic meters."""

    supplyChainConsignmentItemGrossVolume: float = Field(0, description="Volume in cubic meters")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class ItemList(BaseModel):
    """Model representing a list of items."""

    marksAndNos: MarksAndNos = Field(default_factory=MarksAndNos)
    numberOfPackages: NumberOfPackages = Field(default_factory=NumberOfPackages)
    methodOfPacking: MethodOfPacking = Field(default_factory=MethodOfPacking)
    natureOfTheGoods: NatureOfTheGoods = Field(default_factory=NatureOfTheGoods)
    grossWeightInKg: GrossWeightInKg = Field(default_factory=GrossWeightInKg)
    volumeInM3: VolumeInM3 = Field(default_factory=VolumeInM3)

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class ItemListWrapper(BaseModel):
    """Model representing a wrapper for a list of items."""

    itemList: List[ItemList] = Field(
        default_factory=list, description="List of items in the consignment"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class ToBePaidBy(BaseModel):
    """Model representing charges to be paid."""

    customChargeCarriage: str = Field(..., description="Carriage charges")
    customChargeSupplementary: str = Field(..., description="Supplementary charges")
    customChargeCustomsDuties: str = Field(..., description="Customs duties")
    customChargeOther: str = Field(..., description="Other charges")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class Signature(BaseModel):
    """Model representing a signature."""

    type: str = Field(..., description="Signature type")
    userName: str = Field(..., description="Name of the user")
    userCompany: str = Field(..., description="Company of the user")
    userStreet: str = Field(..., description="Street of the user")
    userPostCode: str = Field(..., description="Postcode of the user")
    userCity: str = Field(..., description="City of the user")
    userCountry: str = Field(..., description="Country of the user")
    date: str = Field(..., description="Date of the signature")
    time: str = Field(..., description="Time of the signature")
    data: str = Field(..., description="Data of the signature")
    stampExisting: bool = Field(False, description="Indicates if a stamp exists")
    signatureExisting: bool = Field(False, description="Indicates if a signature exists")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class GoodsReceived(BaseModel):
    """Model representing goods received."""

    confirmedLogisticsLocationName: str = Field(
        ..., description="Confirmed logistics location name"
    )
    consigneeReservationsObservations: str = Field(
        ..., description="Consignee reservations observations"
    )
    consigneeSignature: Signature = Field(
        default_factory=Signature, description="Consignee signature"
    )
    consigneeSignatureDate: str = Field(..., description="Date of consignee signature")
    consigneeTimeOfArrival: str = Field(..., description="Time of arrival")
    consigneeTimeOfDeparture: str = Field(..., description="Time of departure")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class ReferenceIdentificationNumber(BaseModel):
    """Model representing a reference identification number."""

    referenceIdentificationNumber: str = Field(..., description="Reference identification number")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class SignatureOrStampOfTheSender(BaseModel):
    """Model representing the signature or stamp of the sender."""

    signature: Signature = Field(
        default_factory=Signature, description="Signature or stamp of the sender"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class SignatureOrStampOfTheCarrier(BaseModel):
    """Model representing the signature or stamp of the carrier."""

    signature: Signature = Field(
        default_factory=Signature, description="Signature or stamp of the carrier"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class SignatureOrStampOfTheConsignee(BaseModel):
    """Model representing the signature or stamp of the consignee."""

    signature: Signature = Field(
        default_factory=Signature, description="Signature or stamp of the consignee"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class EstablishedDeliveryDate(BaseModel):
    """Model representing the established delivery date."""

    date: str = Field(..., description="Date of establishment")
    place: str = Field(..., description="Place of establishment")
    time: str = Field(..., description="Time of establishment")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class ECMRDocument(BaseModel):
    """Model representing an ECMR document."""

    sender_information: SenderInformation = Field(
        default_factory=SenderInformation, description="Information about the sender"
    )
    consignee_information: ConsigneeInformation = Field(
        default_factory=ConsigneeInformation,
        description="Information about the consignee",
    )
    taking_over_the_goods: TakingOverTheGoods = Field(
        default_factory=TakingOverTheGoods,
        description="Details about taking over the goods",
    )
    delivery_of_the_goods: DeliveryOfTheGoods = Field(
        default_factory=DeliveryOfTheGoods,
        description="Details about delivery of the goods",
    )
    documents_handed_to_carrier: DocumentsHandedToCarrier = Field(
        default_factory=DocumentsHandedToCarrier,
        description="Documents handed to carrier",
    )
    item_list: List[ItemList] = Field(
        default_factory=list, description="List of items in the consignment"
    )
    senders_instructions: SenderInstructions = Field(
        default_factory=SenderInstructions, description="Sender's instructions"
    )
    cash_on_delivery: int = Field(0, description="Cash on delivery amount")
    payment_instructions: str = Field(..., description="Payment instructions")
    carrier_information: CarrierInformation = Field(
        default_factory=CarrierInformation, description="Information about the carrier"
    )
    successive_carrier_information: SuccessiveCarrierInformation = Field(
        default_factory=SuccessiveCarrierInformation,
        description="Information about successive carriers",
    )
    carrier_reservations_and_observations: CarrierReservationsAndObservations = Field(
        default_factory=CarrierReservationsAndObservations,
        description="Carrier's reservations and observations",
    )
    to_be_paid_by: ToBePaidBy = Field(
        default_factory=ToBePaidBy, description="Payment responsibilities"
    )
    other_useful_particulars: str = Field(..., description="Custom particulars of the document")
    signature_or_stamp_of_the_sender: SignatureOrStampOfTheSender = Field(
        default_factory=SignatureOrStampOfTheSender, description="Signature or stamp of the sender"
    )
    signature_or_stamp_of_the_carrier: SignatureOrStampOfTheCarrier = Field(
        default_factory=SignatureOrStampOfTheCarrier,
        description="Signature or stamp of the carrier",
    )
    signature_or_stamp_of_the_consignee: SignatureOrStampOfTheConsignee = Field(
        default_factory=SignatureOrStampOfTheConsignee,
        description="Signature or stamp of the consignee",
    )
    code_carrier: str = Field(..., description="Code of the carrier")
    reference_identification_number: str = Field(
        ..., description="Reference identification number"
    )
    established_delivery_date: EstablishedDeliveryDate = Field(
        default_factory=EstablishedDeliveryDate,
        description="Established date, place and time of delivery",
    )

    class Config:
        """Configuration for the ECMRDocument model."""

        json_schema_extra = {
            "example": {
                "sender_information": {
                    "senderNameCompany": None,
                    "senderNamePerson": None,
                    "senderStreet": None,
                    "senderPostcode": None,
                    "senderCity": None,
                    "senderCountryCode": {"region": None, "value": None},
                    "senderContactInformation": {"email": None, "phone": None},
                },
                "consignee_information": {
                    "consigneeNameCompany": None,
                    "consigneeNamePerson": None,
                    "consigneeStreet": None,
                    "consigneePostcode": None,
                    "consigneeCity": None,
                    "consigneeCountryCode": {"region": None, "value": None},
                    "consigneeContactInformation": {"email": None, "phone": None},
                },
                "taking_over_the_goods": {
                    "takingOverTheGoodsPlace": None,
                    "logisticsDateOfArrival": None,
                    "logisticsTimeOfArrival": None,
                    "logisticsDateOfDeparture": None,
                    "logisticsTimeOfDeparture": None,
                },
                "delivery_of_the_goods": {
                    "logisticsLocationCity": None,
                    "logisticsLocationOpeningHours": None,
                },
                "documents_handed_to_carrier": {"documentsRemarks": None},
                "carrier_information": {
                    "carrierNameCompany": None,
                    "carrierNamePerson": None,
                    "carrierStreet": None,
                    "carrierPostcode": None,
                    "carrierCity": None,
                    "carrierCountryCode": {"region": None, "value": None},
                    "carrierLicensePlate": None,
                    "carrierContactInformation": {"email": None, "phone": None},
                },
                "successive_carrier_information": {
                    "successiveCarrierNameCompany": None,
                    "successiveCarrierNamePerson": None,
                    "successiveCarrierStreet": None,
                    "successiveCarrierPostcode": None,
                    "successiveCarrierCity": None,
                    "successiveCarrierCountryCode": {"region": None, "value": None},
                    "successiveCarrierContactInformation": {
                        "email": None,
                        "phone": None,
                    },
                },
                "carrier_reservations_and_observations": {"carrierReservationsObservations": None},
                "item_list": [
                    {
                        "marksAndNos": {
                            "logisticsShippingMarksMarking": None,
                            "logisticsShippingMarksCustomBarcode": None,
                        },
                        "numberOfPackages": {"logisticsPackageItemQuantity": None},
                        "methodOfPacking": {"logisticsPackageType": None},
                        "natureOfTheGoods": {"transportCargoIdentification": None},
                        "grossWeightInKg": {"supplyChainConsignmentItemGrossWeight": None},
                        "volumeInM3": {"supplyChainConsignmentItemGrossVolume": None},
                    }
                ],
                "senders_instructions": {"transportInstructionsDescription": None},
                "cash_on_delivery": None,
                "payment_instructions": None,
                "to_be_paid_by": {
                    "customChargeCarriage": None,
                    "customChargeSupplementary": None,
                    "customChargeCustomsDuties": None,
                    "customChargeOther": None,
                },
                "other_useful_particulars": None,
                "signature_or_stamp_of_the_sender": {
                    "signature": {
                        "type": None,
                        "userName": None,
                        "userCompany": None,
                        "userStreet": None,
                        "userPostCode": None,
                        "userCity": None,
                        "userCountry": None,
                        "date": None,
                        "time": None,
                        "data": None,
                        "stampExisting": None,
                        "signatureExisting": None,
                    },
                },
                "signature_or_stamp_of_the_carrier": {
                    "signature": {
                        "type": None,
                        "userName": None,
                        "userCompany": None,
                        "userStreet": None,
                        "userPostCode": None,
                        "userCity": None,
                        "userCountry": None,
                        "date": None,
                        "time": None,
                        "data": None,
                        "stampExisting": None,
                        "signatureExisting": None,
                    },
                },
                "signature_or_stamp_of_the_consignee": {
                    "signature": {
                        "type": None,
                        "userName": None,
                        "userCompany": None,
                        "userStreet": None,
                        "userPostCode": None,
                        "userCity": None,
                        "userCountry": None,
                        "date": None,
                        "time": None,
                        "data": None,
                        "stampExisting": None,
                        "signatureExisting": None,
                    },
                },
                "code_carrier": None,
                "referenceIdentificationNumber": None,
                "established_delivery_date": {
                    "date": None,
                    "place": None,
                    "time": None,
                },
            }
        }


class ECMRDocumentReasoning(ECMRDocument):
    """Model representing an ECMR document with reasoning."""

    reasoning: Optional[str] = Field(None, description="Reasoning for generating the reaponse")
