/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogDeleteDocumentComponent } from './delete-document-dialog.component';

describe('DialogDeleteDocumentComponent', () => {
  let component: DialogDeleteDocumentComponent;
  let fixture: ComponentFixture<DialogDeleteDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDeleteDocumentComponent, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogDeleteDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

