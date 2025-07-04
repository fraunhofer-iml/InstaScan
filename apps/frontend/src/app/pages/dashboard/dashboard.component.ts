/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RoutingEnum } from '../../shared/enums/routing.enum';


@Component({
    selector: 'app-scan-document',
    standalone: true,
    imports: [CommonModule, MatButtonModule, RouterLinkActive, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
    protected readonly RoutingEnum = RoutingEnum;
}
