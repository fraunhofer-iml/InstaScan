/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ImageMessagePattern {
  UPLOAD_NEW_IMAGE = 'images/create',
  UPDATE_IMAGE_INFORMATION = 'images/update',
  GET_ALL_IMAGE_INFORMATION = 'images/read',
  GET_IMAGE = 'images/read-by-id',
  REMOVE_IMAGE = 'images/remove',
  PUBLISH_ANALYSIS = 'analysis/publish',
  REFRESH_ANALYSIS = 'analysis/refresh',
  GET_IMAGE_INFORMATION = 'analysis/get',
  GET_IMAGE_NFT = 'images/nft',
  ANALYZE_BUNDLE = 'analysis/bundle/create',
}
