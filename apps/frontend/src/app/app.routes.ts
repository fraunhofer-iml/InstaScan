/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Route } from '@angular/router';
import { RoutingEnum } from './shared/enums/routing.enum';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: RoutingEnum.dashboard,
        pathMatch: 'full'
    },
    {
        path: RoutingEnum.dashboard,
        loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent)
    },
    {
        path:  RoutingEnum.documents,
        loadComponent: () => import('./pages/documents/documents.component').then((m) => m.DocumentsComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./pages/evaluation/evaluation.component').then((m) => m.EvaluationComponent)
    },
];

