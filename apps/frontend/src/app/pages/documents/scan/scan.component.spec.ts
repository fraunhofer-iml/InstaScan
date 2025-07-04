/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScanComponent } from './scan.component';
import { By } from '@angular/platform-browser';
import { ImageStreamService } from './service/image-stream.service';
import { of } from 'rxjs';

describe('ScanComponent', () => {
  let component: ScanComponent;
  let fixture: ComponentFixture<ScanComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanComponent],
      providers: [ImageStreamService]
    }).compileComponents();

    fixture = TestBed.createComponent(ScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render the image with correct src binding', () => {
    component.liveImage.subscribe((imageSrc) => {
      fixture.detectChanges();
      const imgElement = fixture.debugElement.query(By.css('#video'));
      expect(imgElement.nativeElement.src).toContain(imageSrc);
    });
  });
  it('should call captureImage method when button is clicked', () => { 
    jest.spyOn(component, 'captureImage'); 
    component.isCameraConnected = of(true);
    fixture.detectChanges(); 
    const button = fixture.debugElement.query(By.css('button[mat-flat-button]'));
    expect(button).toBeTruthy();
    button.nativeElement.click();
    expect(component.captureImage).toHaveBeenCalled();
  });
});
