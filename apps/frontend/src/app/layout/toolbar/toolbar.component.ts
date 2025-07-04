/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RoutingEnum } from '../../shared/enums/routing.enum';
import {
    MatSidenavContainer,
    MatSidenavContent,
    MatSidenavModule,
} from '@angular/material/sidenav';

@Component({
    selector: 'app-toolbar',
    standalone: true,
    imports: [
        CommonModule,
        MatToolbarModule,
        MatMenuModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        RouterLinkActive,
        MatSidenavContent,
        MatSidenavContainer,
        MatSidenavModule,
    ],
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
    protected readonly RoutingEnum = RoutingEnum;
}
