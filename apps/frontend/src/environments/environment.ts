/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

declare const window: any;
const BASE_URL =  window.env?.BASE_URL || 'http://localhost:3000';
const CAMERA_BASE_URL = window.env?.CAMERA_BASE_URL || `http://${window.location.hostname}:5002`;
export const environment = {
  production: false,
  IMAGE: {
    URL: `${BASE_URL}/images`,
    URL_ANALYSIS: `${BASE_URL}/images/analysis`,
    URL_BUNDLES: `${BASE_URL}/images/bundles`,
  },
  CAMERA: {
    URL: `${CAMERA_BASE_URL}`,
  }
};
