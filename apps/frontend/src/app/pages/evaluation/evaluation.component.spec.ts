/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { of } from 'rxjs';
import { EvaluationComponent } from './evaluation.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageService } from '../../shared/services/image/imageService';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoutingEnum } from '../../shared/enums/routing.enum';
import { ImageInformationDto } from '@ap4/api';
describe('EvaluationComponent', () => {
  let component: EvaluationComponent;
  let fixture: ComponentFixture<EvaluationComponent>;
  const mockActivatedRoute = {
    params: of({ id: '1234-uuid' }),
  };
  const mockRouter = {
    navigate: jest.fn(),
  };
  const mockImageService = {
    getImageByUuid: jest.fn().mockReturnValue(
      of({
        image_analysis_result: '{"label":"CMR","confidence":0.98}',
      })
    ),
    getImageFileByUuid: jest.fn().mockReturnValue(
      of({
        image_base64: 'mockedBase64String',
      })
    ),
    updateImageInformation: jest.fn().mockReturnValue(
      of({
        image_analysis_result: '{"label":"CMR","confidence":0.98}',
      })
    )
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationComponent, BrowserAnimationsModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ImageService, useValue: mockImageService },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(EvaluationComponent);
    component = fixture.componentInstance;
  });

  it('should load data and parse image_analysis_result', () => {
    component.id$.subscribe(() => {
      expect(mockImageService.getImageByUuid).toHaveBeenCalledWith('1234-uuid');
      expect(mockImageService.getImageFileByUuid).toHaveBeenCalledWith('1234-uuid');
      expect(component.encodedImageFile).toBe('data:image/jpeg;base64,mockedBase64String');
      expect(component.getImage.image_analysis_result).toBe({
        label: 'CMR',
        confidence: 0.98,
      });
    });
  });
  it('should save image information and navigate to dashboard (with observable)',() => {
    mockImageService.getImageByUuid('1234-uuid').subscribe(async (data:ImageInformationDto) => {
      data.image_analysis_result = JSON.parse(data.image_analysis_result);
      component.getImage = data;
  
      component.saveImageInformation('1234-uuid');
      expect(mockImageService.updateImageInformation).toHaveBeenCalledWith('1234-uuid',component.getImage);
      expect(mockRouter.navigate).toHaveBeenCalledWith([RoutingEnum.dashboard]);
    });
  });

  it('should update the modified flag', () => {
    expect(component.modified).toBe(false);
    component.onModified(true);
    expect(component.modified).toBe(true);
  });
});
