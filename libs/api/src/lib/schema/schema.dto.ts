/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { EcmrSchemaDto } from "./ecmr.schema.dto";
import { ErrorSchemaDto } from "./error.schema.dto";

export type Schema = EcmrSchemaDto | ErrorSchemaDto;