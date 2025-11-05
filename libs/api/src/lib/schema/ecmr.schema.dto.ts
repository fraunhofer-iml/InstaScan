/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export class EcmrSchemaDto{
    sender_information: SenderInformation | null;
    consignee_information: ConsigneeInformation | null;
    taking_over_the_goods: TakingOverTheGoods | null;
    delivery_of_the_goods: DeliveryOfTheGoods | null;
    documents_handed_to_carrier: DocumentsHandedToCarrier | null;
    item_list: ItemList[] | null;
    senders_instructions: SenderInstructions | null;
    cash_on_delivery: number | null;
    payment_instructions: string | null;
    carrier_information: CarrierInformation | null;
    successive_carrier_information: SuccessiveCarrierInformation | null;
    carrier_reservations_and_observations: CarrierReservationsAndObservations | null;
    to_be_paid_by: ToBePaidBy | null;
    other_useful_particulars: string | null;
    signature_or_stamp_of_the_sender: SignatureOrStampOfTheSender | null;
    signature_or_stamp_of_the_carrier: SignatureOrStampOfTheCarrier | null;
    signature_or_stamp_of_the_consignee: SignatureOrStampOfTheConsignee | null;
    code_carrier: string | null;
    reference_identification_number: string | null;
    established_delivery_date: EstablishedDeliveryDate | null;
    constructor(
        sender_information: SenderInformation | null = null,
        consignee_information: ConsigneeInformation | null = null,
        taking_over_the_goods: TakingOverTheGoods | null = null,
        delivery_of_the_goods: DeliveryOfTheGoods | null = null,
        documents_handed_to_carrier: DocumentsHandedToCarrier | null = null,
        item_list: ItemList[] | null = null,
        senders_instructions: SenderInstructions | null = null,
        cash_on_delivery: number | null = null,
        payment_instructions: string | null = null,
        carrier_information: CarrierInformation | null = null,
        successive_carrier_information: SuccessiveCarrierInformation | null = null,
        carrier_reservations_and_observations: CarrierReservationsAndObservations | null = null,
        to_be_paid_by: ToBePaidBy | null = null,
        other_useful_particulars: string | null = null,
        signature_or_stamp_of_the_sender: SignatureOrStampOfTheSender | null = null,
        signature_or_stamp_of_the_carrier: SignatureOrStampOfTheCarrier | null = null,
        signature_or_stamp_of_the_consignee: SignatureOrStampOfTheConsignee | null = null,
        code_carrier: string | null = null,
        reference_identification_number: string | null = null,
        established_delivery_date: EstablishedDeliveryDate | null = null
    ){
        this.sender_information = sender_information;
        this.consignee_information = consignee_information;
        this.taking_over_the_goods = taking_over_the_goods;
        this.delivery_of_the_goods = delivery_of_the_goods;
        this.documents_handed_to_carrier = documents_handed_to_carrier;
        this.item_list = item_list;
        this.senders_instructions = senders_instructions;
        this.cash_on_delivery = cash_on_delivery;
        this.payment_instructions = payment_instructions;
        this.carrier_information = carrier_information;
        this.successive_carrier_information = successive_carrier_information;
        this.carrier_reservations_and_observations = carrier_reservations_and_observations;
        this.to_be_paid_by = to_be_paid_by;
        this.other_useful_particulars = other_useful_particulars;
        this.signature_or_stamp_of_the_sender = signature_or_stamp_of_the_sender;
        this.signature_or_stamp_of_the_carrier = signature_or_stamp_of_the_carrier;
        this.signature_or_stamp_of_the_consignee = signature_or_stamp_of_the_consignee;
        this.code_carrier = code_carrier;
        this.reference_identification_number = reference_identification_number;
        this.established_delivery_date = established_delivery_date;
    }
}

class CountryCode{
    region: string;
    value: string;
    constructor(region:string, value:string){
        this.region = region;
        this.value = value;
    }
}

class ContactInformation{
    email: string;
    phone: string;
    constructor(email:string, phone:string){
        this.email = email;
        this.phone = phone;
    }
}

class SenderInformation{
    senderNameCompany: string;
    senderNamePerson: string;
    senderStreet: string;
    senderPostcode: string;
    senderCity: string;
    senderCountryCode: CountryCode;
    senderContactInformation: ContactInformation;
    constructor(
        senderNameCompany: string, 
        senderNamePerson: string,
        senderStreet: string,
        senderPostcode: string,
        senderCity: string,
        senderCountryCode: CountryCode,
        senderContactInformation: ContactInformation,
    )
    {
        this.senderNameCompany = senderNameCompany;
        this.senderNamePerson = senderNamePerson;
        this.senderStreet = senderStreet;
        this.senderPostcode = senderPostcode;
        this.senderCity = senderCity;
        this.senderCountryCode = senderCountryCode;
        this.senderContactInformation = senderContactInformation;
    }
}

class ConsigneeInformation{
    consigneeNameCompany: string;
    consigneeNamePerson: string;
    consigneeStreet: string;
    consigneePostcode: string;
    consigneeCity: string;
    consigneeCountryCode: CountryCode;
    consigneeContactInformation: ContactInformation;
    constructor(
        consigneeNameCompany: string,
        consigneeNamePerson: string,
        consigneeStreet: string,
        consigneePostcode: string,
        consigneeCity: string,
        consigneeCountryCode: CountryCode,
        consigneeContactInformation: ContactInformation,
    ){
        this.consigneeNameCompany = consigneeNameCompany;
        this.consigneeNamePerson = consigneeNamePerson;
        this.consigneeStreet = consigneeStreet;
        this.consigneePostcode = consigneePostcode;
        this.consigneeCity = consigneeCity;
        this.consigneeCountryCode = consigneeCountryCode;
        this.consigneeContactInformation = consigneeContactInformation;
    }
}

class TakingOverTheGoods{
    takingOverTheGoodsPlace: string;
    logisticsDateOfArrival: string;
    logisticsTimeOfArrival: string;
    logisticsDateOfDeparture: string;
    logisticsTimeOfDeparture: string;
    constructor(
        takingOverTheGoodsPlace: string,
        logisticsDateOfArrival: string,
        logisticsTimeOfArrival: string,
        logisticsDateOfDeparture: string,
        logisticsTimeOfDeparture: string,
    ){
        this.takingOverTheGoodsPlace = takingOverTheGoodsPlace;
        this.logisticsDateOfArrival = logisticsDateOfArrival;
        this.logisticsTimeOfArrival = logisticsTimeOfArrival;
        this.logisticsDateOfDeparture = logisticsDateOfDeparture;
        this.logisticsTimeOfDeparture = logisticsTimeOfDeparture;
    }
}

class DeliveryOfTheGoods{
    logisticsLocationCity: string;
    logisticsLocationOpeningHours: string;
    constructor(
        logisticsLocationCity: string,
        logisticsLocationOpeningHours: string,
    ){
        this.logisticsLocationCity = logisticsLocationCity;
        this.logisticsLocationOpeningHours = logisticsLocationOpeningHours;
    }
}

class SenderInstructions{
    transportInstructionsDescription: string;
    constructor(
        transportInstructionsDescription: string
    ){
        this.transportInstructionsDescription = transportInstructionsDescription;
    }
}

class CarrierInformation{
    carrierNameCompany: string;
    carrierNamePerson: string;
    carrierStreet: string;
    carrierPostcode: string;
    carrierCity: string;
    carrierCountryCode: CountryCode;
    carrierLicensePlate: string;
    carrierContactInformation: ContactInformation;
    constructor(
        carrierNameCompany: string,
        carrierNamePerson: string,
        carrierStreet: string,
        carrierPostcode: string,
        carrierCity: string,
        carrierCountryCode: CountryCode,
        carrierLicensePlate: string,
        carrierContactInformation: ContactInformation
    ){
        this.carrierNameCompany = carrierNameCompany;
        this.carrierNamePerson = carrierNamePerson;
        this.carrierStreet = carrierStreet;
        this.carrierPostcode = carrierPostcode;
        this.carrierCity = carrierCity;
        this.carrierCountryCode = carrierCountryCode;
        this.carrierLicensePlate = carrierLicensePlate;
        this.carrierContactInformation = carrierContactInformation;
    }
}

class SuccessiveCarrierInformation{
    successiveCarrierNameCompany: string;
    successiveCarrierNamePerson: string;
    successiveCarrierStreet: string;
    successiveCarrierCity: string;
    successiveCarrierContactInformation: ContactInformation;
    constructor(
        successiveCarrierNameCompany: string,
        successiveCarrierNamePerson: string,
        successiveCarrierStreet: string,
        successiveCarrierCity: string,
        successiveCarrierContactInformation: ContactInformation
    ){
        this.successiveCarrierNameCompany = successiveCarrierNameCompany;
        this.successiveCarrierNamePerson = successiveCarrierNamePerson;
        this.successiveCarrierStreet = successiveCarrierStreet;
        this.successiveCarrierCity = successiveCarrierCity;
        this.successiveCarrierContactInformation = successiveCarrierContactInformation;
    }
}

class CarrierReservationsAndObservations {
    carrierReservationsObservations: string;
    constructor(
        carrierReservationsObservations: string
    ){
      this.carrierReservationsObservations = carrierReservationsObservations;
    }
}

class DocumentsHandedToCarrier {
    documentsRemarks: string;
    constructor(
        documentsRemarks: string
    ){
      this.documentsRemarks = documentsRemarks;
    }
}

class MarksAndNos{
    logisticsShippingMarksMarking: string;
    logisticsShippingMarksCustomBarcode: string;
    constructor(
        logisticsShippingMarksMarking: string,
        logisticsShippingMarksCustomBarcode: string
    ){
        this.logisticsShippingMarksMarking = logisticsShippingMarksMarking;
        this.logisticsShippingMarksCustomBarcode = logisticsShippingMarksCustomBarcode;
    }
}

class NumberOfPackages{
    logisticsPackageItemQuantity: number;
    constructor(
        logisticsPackageItemQuantity: number
    ){
        this.logisticsPackageItemQuantity = logisticsPackageItemQuantity;
    }
}

class MethodOfPacking{
    logisticsPackageType: string;
    constructor(
        logisticsPackageType:string
    ){
        this.logisticsPackageType = logisticsPackageType;
    }
}

class NatureOfTheGoods{
    transportCargoIdentification: string;
    constructor(
        transportCargoIdentification:string
    ){
        this.transportCargoIdentification = transportCargoIdentification;
    }
}

class GrossWeightInKg{
    supplyChainConsignmentItemGrossWeight: number;
    constructor(
        supplyChainConsignmentItemGrossWeight:number
    ){
        this.supplyChainConsignmentItemGrossWeight = supplyChainConsignmentItemGrossWeight;
    }
}

class VolumeInM3{
    supplyChainConsignmentItemGrossVolume: number;
    constructor(
        supplyChainConsignmentItemGrossVolume:number
    ){
        this.supplyChainConsignmentItemGrossVolume = supplyChainConsignmentItemGrossVolume;
    }
}

class ItemList{
    marksAndNos: MarksAndNos;
    numberOfPackages: NumberOfPackages;
    methodOfPacking: MethodOfPacking;
    natureOfTheGoods: NatureOfTheGoods;
    grossWeightInKg: GrossWeightInKg;
    volumeInM3: VolumeInM3;
    constructor(
        marksAndNos: MarksAndNos,
        numberOfPackages: NumberOfPackages,
        methodOfPacking: MethodOfPacking,
        natureOfTheGoods: NatureOfTheGoods,
        grossWeightInKg: GrossWeightInKg,
        volumeInM3: VolumeInM3
    ){
        this.marksAndNos = marksAndNos;
        this.numberOfPackages = numberOfPackages;
        this.methodOfPacking = methodOfPacking;
        this.natureOfTheGoods = natureOfTheGoods;
        this.grossWeightInKg = grossWeightInKg;
        this.volumeInM3 = volumeInM3;
    }
}

class ToBePaidBy{
    customChargeCarriage: string;
    customChargeSupplementary: string;
    customChargeCustomsDuties: string;
    customChargeOther: string;
    constructor(
        customChargeCarriage: string,
        customChargeSupplementary: string,
        customChargeCustomsDuties: string,
        customChargeOther: string
    )
    {
        this.customChargeCarriage = customChargeCarriage;
        this.customChargeSupplementary = customChargeSupplementary;
        this.customChargeCustomsDuties = customChargeCustomsDuties;
        this.customChargeOther = customChargeOther;
    }
}

class Signature{
    type: string;
    userName: string;
    userCompany: string;
    userStreet: string;
    userPostCode: string;
    userCity: string;
    userCountry: string;
    date: string;
    time: string;
    data: string;
    stampExisting: boolean;
    signatureExisting: boolean;
    constructor(
        type: string,
        userName: string,
        userCompany: string,
        userStreet: string,
        userPostCode: string,
        userCity: string,
        userCountry: string,
        date: string,
        time: string,
        data: string,
        stampExisting: boolean,
        signatureExisting: boolean
    ){
        this.type = type;
        this.userName = userName;
        this.userCompany = userCompany;
        this.userStreet = userStreet;
        this.userPostCode = userPostCode;
        this.userCity = userCity;
        this.userCountry = userCountry;
        this.date = date;
        this.time = time;
        this.data = data;
        this.stampExisting = stampExisting;
        this.signatureExisting = signatureExisting;
    }
}

class SignatureOrStampOfTheSender {
    signature: Signature;
    constructor(
        signature:Signature
    ){
        this.signature = signature;
    }
}

class SignatureOrStampOfTheCarrier {
    signature: Signature;
    constructor(
        signature:Signature
    ){
        this.signature = signature;
    }
}

class SignatureOrStampOfTheConsignee {
    signature: Signature;
    constructor(
        signature:Signature
    ){
        this.signature = signature;
    }
}

class EstablishedDeliveryDate{
    date: string;
    place: string;
    time: string;
    constructor(
        date:string, 
        place:string, 
        time:string
    ){
        this.date = date;
        this.place = place;
        this.time = time;
    }
}