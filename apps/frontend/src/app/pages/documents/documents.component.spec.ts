/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentsComponent } from './documents.component';
import { of } from 'rxjs';
import { ImageService } from '../../shared/services/image/imageService';
import { ErrorSchemaDto, ImageInformationDto } from '@ap4/api';
import { AnalysisStatus, DocumentTypeId, DocumentUploadType } from '@ap4/utils';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

jest.mock('pdfjs-dist', () => ({
    GlobalWorkerOptions: {
        workerSrc: 'pdf.worker.js',
    },
    getDocument: jest.fn().mockReturnValue(() => {
        return Promise.resolve({
            getPage: {
                getViewport: {
                    height: 5,
                    width: 5
                }
            }
        })
    })
}));

describe('DocumentsComponent', () => {
    let component: DocumentsComponent;
    let fixture: ComponentFixture<DocumentsComponent>;

    const mockImages: ImageInformationDto[] = [
        {
            uuid: '1',
            sender: 'testSender',
            receiver: 'testReceiver',
            creationDate: new Date(),
            lastModified: new Date(),
            documentUploadType: DocumentUploadType.JPEG,
            analysisStatus: AnalysisStatus.IN_PROGRESS,
            documentType: DocumentTypeId.CMR,
            bundleId: 'bundleId',
            image_analysis_result: new ErrorSchemaDto('status', 'message', 'error_details'),
        },
    ];

  const mockImageService = {
    deleteImage: jest.fn(),
    getImages: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsComponent, BrowserAnimationsModule],
      providers: [
        { provide: ImageService, useValue: mockImageService },
        {
          provide: ActivatedRoute,
          useValue: { params: of('1') },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentsComponent);
    component = fixture.componentInstance;
    component.initializeDataSource = jest.fn();
    fixture.detectChanges();
  });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should transform status correctly', () => {
        expect(component.transformStatus('IN_PROGRESS')).toBe('in progress');
        expect(component.transformStatus('')).toBe('');
    });

    it('should call getImages and set dataSource', () => {
        jest.spyOn(component['imageService'], 'getImages').mockReturnValue(
            of(mockImages)
        );
        component['initializeDataSource']();
        component.dataSource$.subscribe((dataSource) => {
            expect(dataSource.data.length).toBe(1);
            expect(dataSource.data[0].uuid).toBe('1');
        });
    });

    it('should setup paginator from localStorage and store on page', () => {
        const dataSource = new MatTableDataSource<ImageInformationDto>([]);
        const setItemSpy = jest.spyOn(window.localStorage['__proto__'], 'setItem');

        component['setupPaginator'](dataSource);

        const event: PageEvent = { pageIndex: 0, pageSize: 50, length: 100 };
        component['paginator'].page.next(event);
        expect(setItemSpy).toHaveBeenCalledWith('itemsPerPage', '50');
    });

  it('should call deleteImage and then initializeDataSource', () => {
    const uuid = '1234-uuid';
    mockImageService.deleteImage.mockReturnValue(of(null));

    component.deleteImage(uuid);
    expect(component.initializeDataSource).toHaveBeenCalled();
  });
});


