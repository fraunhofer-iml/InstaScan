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

    region: Optional[str] = Field(None, description="Region of the country")
    value: Optional[str] = Field(None, description="Country code")


class ContactInformation(BaseModel):
    """Model representing contact information."""

    email: Optional[str] = Field(None, description="Contact email")
    phone: Optional[str] = Field(None, description="Contact phone number")


class SenderInformation(BaseModel):
    """Model representing sender information."""

    senderNameCompany: Optional[str] = Field(None, description="Sender Company Name")
    senderNamePerson: Optional[str] = Field(None, description="Sender Person Name")
    senderStreet: Optional[str] = Field(None, description="Sender Street")
    senderPostcode: Optional[str] = Field(None, description="Sender Postcode")
    senderCity: Optional[str] = Field(None, description="Sender City")
    senderCountryCode: Optional[CountryCode] = Field(
        default_factory=CountryCode, description="Sender Country Code"
    )
    senderContactInformation: Optional[ContactInformation] = Field(
        default_factory=ContactInformation, description="Sender Contact Information"
    )


class ConsigneeInformation(BaseModel):
    """Model representing consignee information."""

    consigneeNameCompany: Optional[str] = Field(None, description="Consignee Company Name")
    consigneeNamePerson: Optional[str] = Field(None, description="Consignee Person Name")
    consigneeStreet: Optional[str] = Field(None, description="Consignee Street")
    consigneePostcode: Optional[str] = Field(None, description="Consignee Postcode")
    consigneeCity: Optional[str] = Field(None, description="Consignee City")
    consigneeCountryCode: Optional[CountryCode] = Field(
        default_factory=CountryCode, description="Consignee Country Code"
    )
    consigneeContactInformation: Optional[ContactInformation] = Field(
        default_factory=ContactInformation, description="Consignee Contact Information"
    )


class TakingOverTheGoods(BaseModel):
    """Model representing the details of taking over the goods."""

    takingOverTheGoodsPlace: Optional[str] = Field(
        None, description="Place of taking over the goods"
    )
    logisticsDateOfArrival: Optional[str] = Field(None, description="Date of arrival")
    logisticsTimeOfArrival: Optional[str] = Field(None, description="Time of arrival")
    logisticsDateOfDeparture: Optional[str] = Field(None, description="Date of departure")
    logisticsTimeOfDeparture: Optional[str] = Field(None, description="Time of departure")


class DeliveryOfTheGoods(BaseModel):
    """Model representing the delivery of the goods."""

    logisticsLocationCity: Optional[str] = Field(None, description="City of logistics location")
    logisticsLocationOpeningHours: Optional[str] = Field(
        None, description="Opening hours of logistics location"
    )


class SenderInstructions(BaseModel):
    """Model representing sender instructions."""

    transportInstructionsDescription: Optional[str] = Field(
        None, description="Transport Instructions Description"
    )


class CarrierInformation(BaseModel):
    """Model representing carrier information."""

    carrierNameCompany: Optional[str] = Field(None, description="Carrier Company Name")
    carrierNamePerson: Optional[str] = Field(None, description="Carrier Person Name")
    carrierStreet: Optional[str] = Field(None, description="Carrier Street")
    carrierPostcode: Optional[str] = Field(None, description="Carrier Postcode")
    carrierCity: Optional[str] = Field(None, description="Carrier City")
    carrierCountryCode: Optional[CountryCode] = Field(
        default_factory=CountryCode, description="Carrier Country Code"
    )
    carrierLicensePlate: Optional[str] = Field(None, description="Carrier License Plate")
    carrierContactInformation: Optional[ContactInformation] = Field(
        default_factory=ContactInformation, description="Carrier Contact Information"
    )


class SuccessiveCarrierInformation(BaseModel):
    """Model representing successive carrier information."""

    successiveCarrierNameCompany: Optional[str] = Field(
        None, description="Successive Carrier Company Name"
    )
    successiveCarrierNamePerson: Optional[str] = Field(
        None, description="Successive Carrier Person Name"
    )
    successiveCarrierStreet: Optional[str] = Field(None, description="Successive Carrier Street")
    successiveCarrierPostcode: Optional[str] = Field(
        None, description="Successive Carrier Postcode"
    )
    successiveCarrierCity: Optional[str] = Field(None, description="Successive Carrier City")
    successiveCarrierCountryCode: Optional[CountryCode] = Field(
        default_factory=CountryCode, description="Successive Carrier Country Code"
    )
    successiveCarrierContactInformation: Optional[ContactInformation] = Field(
        default_factory=ContactInformation,
        description="Successive Carrier Contact Information",
    )


class CarrierReservationsAndObservations(BaseModel):
    """Model representing carrier reservations and observations."""

    carrierReservationsObservations: Optional[str] = Field(
        None, description="Carrier Reservations Observations"
    )


class DocumentsHandedToCarrier(BaseModel):
    """Model representing documents handed to the carrier."""

    documentsRemarks: Optional[str] = Field(
        None, description="Remarks about documents handed to carrier"
    )


class MarksAndNos(BaseModel):
    """Model representing marks and numbers."""

    logisticsShippingMarksMarking: Optional[str] = Field(None, description="Shipping marks")
    logisticsShippingMarksCustomBarcode: Optional[str] = Field(None, description="Custom barcode")


class NumberOfPackages(BaseModel):
    """Model representing the number of packages."""

    logisticsPackageItemQuantity: Optional[int] = Field(None, description="Number of packages")


class MethodOfPacking(BaseModel):
    """Model representing the method of packing."""

    logisticsPackageType: Optional[str] = Field(None, description="Type of package")


class NatureOfTheGoods(BaseModel):
    """Model representing the nature of the goods."""

    transportCargoIdentification: Optional[str] = Field(None, description="Cargo identification")


class GrossWeightInKg(BaseModel):
    """Model representing the gross weight in kilograms."""

    supplyChainConsignmentItemGrossWeight: Optional[float] = Field(
        None, description="Gross weight in kg"
    )


class VolumeInM3(BaseModel):
    """Model representing the volume in cubic meters."""

    supplyChainConsignmentItemGrossVolume: Optional[float] = Field(
        None, description="Volume in cubic meters"
    )


class ItemList(BaseModel):
    """Model representing a list of items."""

    marksAndNos: MarksAndNos = Field(default_factory=MarksAndNos)
    numberOfPackages: NumberOfPackages = Field(default_factory=NumberOfPackages)
    methodOfPacking: MethodOfPacking = Field(default_factory=MethodOfPacking)
    natureOfTheGoods: NatureOfTheGoods = Field(default_factory=NatureOfTheGoods)
    grossWeightInKg: GrossWeightInKg = Field(default_factory=GrossWeightInKg)
    volumeInM3: VolumeInM3 = Field(default_factory=VolumeInM3)


class ItemListWrapper(BaseModel):
    """Model representing a wrapper for a list of items."""

    itemList: List[ItemList] = Field(
        default_factory=list, description="List of items in the consignment"
    )


class ToBePaidBy(BaseModel):
    """Model representing charges to be paid."""

    customChargeCarriage: Optional[str] = Field(default=None, description="Carriage charges")
    customChargeSupplementary: Optional[str] = Field(
        default=None, description="Supplementary charges"
    )
    customChargeCustomsDuties: Optional[str] = Field(default=None, description="Customs duties")
    customChargeOther: Optional[str] = Field(default=None, description="Other charges")


class Signature(BaseModel):
    """Model representing a signature."""

    type: Optional[str] = Field(None, description="Signature type")
    userName: Optional[str] = Field(None, description="Name of the user")
    userCompany: Optional[str] = Field(None, description="Company of the user")
    userStreet: Optional[str] = Field(None, description="Street of the user")
    userPostCode: Optional[str] = Field(None, description="Postcode of the user")
    userCity: Optional[str] = Field(None, description="City of the user")
    userCountry: Optional[str] = Field(None, description="Country of the user")
    date: Optional[str] = Field(None, description="Date of the signature")
    time: Optional[str] = Field(None, description="Time of the signature")
    data: Optional[str] = Field(None, description="Data of the signature")
    stampExisting: Optional[bool] = Field(None, description="Indicates if a stamp exists")
    signatureExisting: Optional[bool] = Field(None, description="Indicates if a signature exists")


class GoodsReceived(BaseModel):
    """Model representing goods received."""

    confirmedLogisticsLocationName: Optional[str] = Field(
        None, description="Confirmed logistics location name"
    )
    consigneeReservationsObservations: Optional[str] = Field(
        None, description="Consignee reservations observations"
    )
    consigneeSignature: Optional[Signature] = Field(
        default_factory=Signature, description="Consignee signature"
    )
    consigneeSignatureDate: Optional[str] = Field(None, description="Date of consignee signature")
    consigneeTimeOfArrival: Optional[str] = Field(None, description="Time of arrival")
    consigneeTimeOfDeparture: Optional[str] = Field(None, description="Time of departure")


class ReferenceIdentificationNumber(BaseModel):
    """Model representing a reference identification number."""

    referenceIdentificationNumber: Optional[str] = Field(
        None, description="Reference identification number"
    )


class SignatureOrStampOfTheSender(BaseModel):
    """Model representing the signature or stamp of the sender."""

    signature: Optional[Signature] = Field(
        default_factory=Signature, description="Signature or stamp of the sender"
    )


class SignatureOrStampOfTheCarrier(BaseModel):
    """Model representing the signature or stamp of the carrier."""

    signature: Optional[Signature] = Field(
        default_factory=Signature, description="Signature or stamp of the carrier"
    )


class SignatureOrStampOfTheConsignee(BaseModel):
    """Model representing the signature or stamp of the consignee."""

    signature: Optional[Signature] = Field(
        default_factory=Signature, description="Signature or stamp of the consignee"
    )


class EstablishedDeliveryDate(BaseModel):
    """Model representing the established delivery date."""

    date: Optional[str] = Field(None, description="Date of establishment")
    place: Optional[str] = Field(None, description="Place of establishment")
    time: Optional[str] = Field(None, description="Time of establishment")


class ECMRDocument(BaseModel):
    """Model representing an ECMR document."""

    sender_information: Optional[SenderInformation] = Field(
        default_factory=SenderInformation, description="Information about the sender"
    )
    consignee_information: Optional[ConsigneeInformation] = Field(
        default_factory=ConsigneeInformation,
        description="Information about the consignee",
    )
    taking_over_the_goods: Optional[TakingOverTheGoods] = Field(
        default_factory=TakingOverTheGoods,
        description="Details about taking over the goods",
    )
    delivery_of_the_goods: Optional[DeliveryOfTheGoods] = Field(
        default_factory=DeliveryOfTheGoods,
        description="Details about delivery of the goods",
    )
    documents_handed_to_carrier: Optional[DocumentsHandedToCarrier] = Field(
        default_factory=DocumentsHandedToCarrier,
        description="Documents handed to carrier",
    )
    item_list: Optional[List[ItemList]] = Field(
        default_factory=list, description="List of items in the consignment"
    )
    senders_instructions: Optional[SenderInstructions] = Field(
        default_factory=SenderInstructions, description="Sender's instructions"
    )
    cash_on_delivery: Optional[int] = Field(None, description="Cash on delivery amount")
    payment_instructions: Optional[str] = Field(None, description="Payment instructions")
    carrier_information: Optional[CarrierInformation] = Field(
        default_factory=CarrierInformation, description="Information about the carrier"
    )
    successive_carrier_information: Optional[SuccessiveCarrierInformation] = Field(
        default_factory=SuccessiveCarrierInformation,
        description="Information about successive carriers",
    )
    carrier_reservations_and_observations: Optional[CarrierReservationsAndObservations] = Field(
        default_factory=CarrierReservationsAndObservations,
        description="Carrier's reservations and observations",
    )
    to_be_paid_by: Optional[ToBePaidBy] = Field(
        default_factory=ToBePaidBy, description="Payment responsibilities"
    )
    other_useful_particulars: Optional[str] = Field(
        None, description="Custom particulars of the document"
    )
    signature_or_stamp_of_the_sender: Optional[SignatureOrStampOfTheSender] = Field(
        default_factory=SignatureOrStampOfTheSender, description="Signature or stamp of the sender"
    )
    signature_or_stamp_of_the_carrier: Optional[SignatureOrStampOfTheCarrier] = Field(
        default_factory=SignatureOrStampOfTheCarrier,
        description="Signature or stamp of the carrier",
    )
    signature_or_stamp_of_the_consignee: Optional[SignatureOrStampOfTheConsignee] = Field(
        default_factory=SignatureOrStampOfTheConsignee,
        description="Signature or stamp of the consignee",
    )
    code_carrier: Optional[str] = Field(None, description="Code of the carrier")
    reference_identification_number: Optional[str] = Field(
        None, description="Reference identification number"
    )
    established_delivery_date: Optional[EstablishedDeliveryDate] = Field(
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
