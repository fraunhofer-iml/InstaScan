/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from './layout/toolbar/toolbar.component';

@Component({
  standalone: true,
  imports: [RouterModule, ToolbarComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
}
