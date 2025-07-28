/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export enum DocumentUploadType{
    PDF = 'PDF',
    JPEG = 'JPEG'
}

export type UploadValue = {
    extension: string;
    mimeType: string;
};

export const DOCUMENT_UPLOAD_TYPE_TO_UPLOAD_VALUES: Record<DocumentUploadType, UploadValue> = {
    [DocumentUploadType.PDF]: {
        extension: '.pdf',
        mimeType: 'data:application/pdf;base64,'
    },
    [DocumentUploadType.JPEG]: {
        extension: '.jpg',
        mimeType: 'data:image/jpeg;base64,'
    }
};
