/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisStatus } from '@ap4/utils';

export const STATUS_ICONS_MAP: Record<AnalysisStatus, string> = {
  [AnalysisStatus.IN_PROGRESS]: 'cached',
  [AnalysisStatus.FINISHED]: 'check',
  [AnalysisStatus.FAILED]: 'close',
  [AnalysisStatus.APPROVED]: 'check_circle',
  [AnalysisStatus.PENDING]: 'pending',
};
