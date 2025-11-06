# Copyright Fraunhofer Institute for Material Flow and Logistics
#
# Licensed under the Apache License, Version 2.0 (the "License").
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: Apache-2.0

"""Schema definitions for Delivery Note documents."""

from typing import List, Literal

from pydantic import BaseModel, Field


# mypy: disable-error-code=arg-type
class CountryCode(BaseModel):
    """Country code information."""

    region: str = Field(..., description="Region of the country")
    value: str = Field(..., description="Country code")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class ContactInformation(BaseModel):
    """Contact information details."""

    email: str = Field(..., description="Contact email")
    phone: str = Field(..., description="Contact phone number")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class SenderInformation(BaseModel):
    """Sender information details."""

    senderNameCompany: str = Field(..., description="Company Name of the Sender")
    senderNamePerson: str = Field(..., description="Person Name of the Sender")
    senderStreet: str = Field(..., description="Sender Street")
    senderPostcode: str = Field(..., description="Sender Postcode")
    senderCity: str = Field(..., description="Sender City")
    senderCountryCode: CountryCode = Field(
        default_factory=CountryCode,
        description="Sender Country Code",
        json_schema_extra={
            "additionalProperties": False,
            "required": ["region", "value"],
        },
    )
    senderContactInformation: ContactInformation = Field(
        default_factory=ContactInformation,
        description="Sender Contact Information",
        json_schema_extra={
            "additionalProperties": False,
            "required": ["email", "phone"],
        },
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class ConsigneeInformation(BaseModel):
    """Consignee information details."""

    consigneeNameCompany: str = Field(..., description="Company Name of the Consignee")
    consigneeNamePerson: str = Field(..., description="Person Name of the Consignee")
    consigneeStreet: str = Field(..., description="Consignee Street")
    consigneePostcode: str = Field(..., description="Consignee Postcode")
    consigneeCity: str = Field(..., description="Consignee City")
    consigneeCountryCode: CountryCode = Field(
        default_factory=CountryCode,
        description="Consignee Country Code",
        json_schema_extra={
            "additionalProperties": False,
            "required": ["region", "value"],
        },
    )
    consigneeContactInformation: ContactInformation = Field(
        default_factory=ContactInformation,
        description="Consignee Contact Information",
        json_schema_extra={
            "additionalProperties": False,
            "required": ["email", "phone"],
        },
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class TakingOverTheGoods(BaseModel):
    """Details about taking over the goods."""

    takingOverTheGoodsPlace: str = Field(..., description="Place of taking over the goods")
    logisticsDateOfDeparture: str = Field(..., description="Date of departure")
    logisticsTimeOfDeparture: str = Field(..., description="Time of departure")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class DeliveryOfTheGoods(BaseModel):
    """Details about delivery of the goods."""

    logisticsLocationCity: str = Field(..., description="City of logistics location")
    logisticsLocationOpeningHours: str = Field(
        ..., description="Opening hours of logistics location"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class SendersInstructions(BaseModel):
    """Sender's instructions details."""

    transportInstructionsDescription: str = Field(
        ..., description="Transport Instructions Description"
    )
    shippingMethod: str = Field(..., description="Shipping method")
    incoterms: str = Field(..., description="Incoterms")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class CarrierInformation(BaseModel):
    """Carrier information details."""

    carrierNameCompany: str = Field(..., description="Company Name of the Carrier")
    carrierNamePerson: str = Field(..., description="Person Name of the Carrier")
    carrierStreet: str = Field(..., description="Carrier Street")
    carrierPostcode: str = Field(..., description="Carrier Postcode")
    carrierCity: str = Field(..., description="Carrier City")
    carrierCountryCode: CountryCode = Field(
        default_factory=CountryCode,
        description="Carrier Country Code",
        json_schema_extra={
            "additionalProperties": False,
            "required": ["region", "value"],
        },
    )
    carrierContactInformation: ContactInformation = Field(
        default_factory=ContactInformation,
        description="Carrier Contact Information",
        json_schema_extra={
            "additionalProperties": False,
            "required": ["email", "phone"],
        },
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class SuccessiveCarrierInformation(BaseModel):
    """Successive carrier information details."""

    successiveCarrierNameCompany: str = Field(
        ..., description="Company Name of the Successive Carrier"
    )
    successiveCarrierNamePerson: str = Field(
        ..., description="Person Name of the Successive Carrier"
    )
    successiveCarrierStreet: str = Field(..., description="Successive Carrier Street")
    successiveCarrierPostcode: str = Field(..., description="Successive Carrier Postcode")
    successiveCarrierCity: str = Field(..., description="Successive Carrier City")
    successiveCarrierCountryCode: CountryCode = Field(
        default_factory=CountryCode,
        description="Successive Carrier Country Code",
        json_schema_extra={
            "additionalProperties": False,
            "required": ["region", "value"],
        },
    )
    successiveCarrierContactInformation: ContactInformation = Field(
        default_factory=ContactInformation,
        description="Successive Carrier Contact Information",
        json_schema_extra={
            "additionalProperties": False,
            "required": ["email", "phone"],
        },
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class CarrierReservationsAndObservations(BaseModel):
    """Carrier reservations and observations details."""

    carrierReservationsObservations: str = Field(
        ..., description="Carrier Reservations Observations"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class DocumentsHandedToCarrier(BaseModel):
    """Details about documents handed to the carrier."""

    documentsRemarks: str = Field(..., description="Remarks about documents handed to the carrier")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class MarksAndNos(BaseModel):
    """Marks and numbers details."""

    logisticsShippingMarksMarking: str = Field(..., description="Shipping marks")
    logisticsShippingMarksCustomBarcode: str = Field(..., description="Custom barcode")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class NumberOfPackages(BaseModel):
    """Number of packages details."""

    logisticsPackageItemQuantity: int = Field(..., description="Number of packages")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class MethodOfPacking(BaseModel):
    """Method of packing details."""

    logisticsPackageType: str = Field(..., description="Type of package")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class NatureOfTheGoods(BaseModel):
    """Nature of the goods details."""

    transportCargoNumber: str = Field(..., description="Transport Cargo number")
    transportCargoIdentification: str = Field(..., description="Cargo identification")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class GrossWeightInKg(BaseModel):
    """Gross weight in kg details."""

    supplyChainConsignmentItemGrossWeight: float = Field(..., description="Gross weight in kg")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class VolumeInM3(BaseModel):
    """Volume in cubic meters details."""

    supplyChainConsignmentItemGrossVolume: float = Field(..., description="Volume in cubic meters")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class ItemList(BaseModel):
    """Item list details."""

    marksAndNos: MarksAndNos = Field(
        default_factory=MarksAndNos,
        description="Marks and numbers of the item",
    )
    numberOfPackages: NumberOfPackages = Field(
        default_factory=NumberOfPackages,
        description="Number of packages of the item",
    )
    methodOfPacking: MethodOfPacking = Field(
        default_factory=MethodOfPacking,
        description="Method of packing of the item",
    )
    natureOfTheGoods: NatureOfTheGoods = Field(
        default_factory=NatureOfTheGoods,
        description="Nature or designation of the goods",
    )
    grossWeightInKg: GrossWeightInKg = Field(
        default_factory=GrossWeightInKg,
        description="Gross weight in kg of the item",
    )
    volumeInM3: VolumeInM3 = Field(
        default_factory=VolumeInM3,
        description="Volume in cubic meters of the item",
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class ToBePaidBy(BaseModel):
    """Details about charges to be paid by."""

    customChargeCarriage: str = Field(..., description="Carriage charges")
    customChargeSupplementary: str = Field(..., description="Supplementary charges")
    customChargeCustomsDuties: str = Field(..., description="Customs duties")
    customChargeOther: str = Field(..., description="Other charges")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class Signature(BaseModel):
    """Details about a signature or stamp."""

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
    stamp_existing: Literal["True", "False", "Unknown"] = Field(
        ..., description="Indicates if a stamp exists"
    )
    signature_existing: Literal["True", "False", "Unknown"] = Field(
        ..., description="Indicates if a signature exists"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class SignatureOrStampOfTheSender(BaseModel):
    """Details about the sender's signature or stamp."""

    senderSignature: Signature = Field(
        default_factory=Signature, description="Signature of the sender"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class SignatureOrStampOfTheCarrier(BaseModel):
    """Details about the carrier's signature or stamp."""

    carrierSignature: Signature = Field(
        default_factory=Signature, description="Signature of the carrier"
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class Established(BaseModel):
    """Details about establishment."""

    customEstablishedDate: str = Field(..., description="Date of establishment")
    customEstablishedPlace: str = Field(..., description="Place of establishment")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class SignatureOrStampOfTheConsignee(BaseModel):
    """Details about the consignee's signature or stamp."""

    consigneeSignature: Signature = Field(
        default_factory=Signature,
        description="Consignee signature",
        json_schema_extra={
            "additionalProperties": False,
            "required": [
                "type",
                "userName",
                "userCompany",
                "userStreet",
                "userPostCode",
                "userCity",
                "userCountry",
                "date",
                "time",
                "data",
                "stamp_existing",
                "signature_existing",
            ],
        },
    )
    consigneeSignatureDate: str = Field(..., description="Date of consignee signature")
    consigneeTimeOfArrival: str = Field(..., description="Time of arrival")
    consigneeTimeOfDeparture: str = Field(..., description="Time of departure")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class ReferenceIdentificationNumber(BaseModel):
    """Reference identification number details."""

    referenceIdentificationNumber: str = Field(..., description="Reference identification number")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class EstablishedDeliveryDate(BaseModel):
    """Established delivery date details."""

    date: str = Field(..., description="Established delivery date")
    place: str = Field(..., description="Place of established delivery")
    time: str = Field(..., description="Time of established delivery")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class PaymentInstructions(BaseModel):
    """Payment instructions details."""

    paymentReferenceNumber: str = Field(..., description="Payment reference number")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class ShipmentWeight(BaseModel):
    """Shipment weight details."""

    grossWeight: str = Field(..., description="Gross weight")
    netWeight: str = Field(..., description="Net weight")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class OrderInformation(BaseModel):
    """Order information details."""

    reference_identification_number: str = Field(
        ..., description="Reference identification number"
    )
    supplierOrderNumber: str = Field(..., description="Supplier order number")
    customerOrderNumber: str = Field(..., description="Customer order number")
    goodsReceiptNotificationNumber: str = Field(
        ..., description="Goods receipt notification number"
    )
    order_identification_number: str = Field(..., description="Order identification number")
    internalOrderDate: str = Field(..., description="Internal order date")
    shipment_weight: ShipmentWeight = Field(
        default_factory=ShipmentWeight, description="Shipment weight"
    )
    senders_instructions: SendersInstructions = Field(
        default_factory=SendersInstructions,
        description="Sender's instructions",
    )

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class DeliveryNoteDocument(BaseModel):
    """Schema for Delivery Note Document."""

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
    established_delivery_date: EstablishedDeliveryDate = Field(
        default_factory=EstablishedDeliveryDate,
        description="Established delivery date",
    )
    documents_handed_to_carrier: DocumentsHandedToCarrier = Field(
        default_factory=DocumentsHandedToCarrier,
        description="Documents handed to carrier",
    )
    item_list: List[ItemList] = Field(
        default_factory=list, description="List of items in the consignment"
    )
    payment_instructions: PaymentInstructions = Field(
        default_factory=PaymentInstructions,
        description="Payment instructions for the consignment",
    )
    carrier_information: CarrierInformation = Field(
        default_factory=CarrierInformation, description="Information about the carrier"
    )
    goods_classification: str = Field(..., description="Classification of the goods")
    other_useful_particulars: str = Field(..., description="Custom particulars of the document")
    order_information: OrderInformation = Field(
        default_factory=OrderInformation, description="Order information"
    )

    class Config:
        """Configuration to prevent extension of the class."""

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
                    "logisticsDateOfDeparture": None,
                    "logisticsTimeOfDeparture": None,
                },
                "established_delivery_date": {
                    "date": None,
                    "place": None,
                    "time": None,
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
                        "natureOfTheGoods": {
                            "transportCargoNumber": None,
                            "transportCargoIdentification": None,
                        },
                        "grossWeightInKg": {"supplyChainConsignmentItemGrossWeight": None},
                        "volumeInM3": {"supplyChainConsignmentItemGrossVolume": None},
                    }
                ],
                "payment_instructions": {"paymentReferenceNumber": None},
                "carrier_information": {
                    "carrierNameCompany": None,
                    "carrierNamePerson": None,
                    "carrierStreet": None,
                    "carrierPostcode": None,
                    "carrierCity": None,
                    "carrierCountryCode": {"region": None, "value": None},
                    "carrierContactInformation": {"email": None, "phone": None},
                },
                "goods_classification": None,
                "other_useful_particulars": None,
                "order_information": {
                    "reference_identification_number": None,
                    "supplierOrderNumber": None,
                    "customerOrderNumber": None,
                    "goodsReceiptNotificationNumber": None,
                    "order_identification_number": None,
                    "internalOrderDate": None,
                    "shipment_weight": {"grossWeight": None, "netWeight": None},
                    "senders_instructions": {
                        "transportInstructionsDescription": None,
                        "shippingMethod": None,
                        "incoterms": None,
                    },
                },
            }
        }


class BaseSchemaReasoning(DeliveryNoteDocument):
    """Schema for Delivery Note Document with reasoning."""

    reasoning: str = Field(..., description="Reasoning for generating the response")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"


class BaseSchemaChanges(DeliveryNoteDocument):
    """Schema for Delivery Note Document with changes."""

    changes: str = Field(..., description="Changes made to the document")

    class Config:
        """Configuration to prevent extension of the class."""

        extra = "forbid"
