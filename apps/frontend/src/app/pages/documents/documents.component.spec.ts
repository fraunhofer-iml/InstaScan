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
import { AnalysisStatus, DocumentTypeId } from '@ap4/utils';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

describe('DocumentsComponent', () => {
    let component: DocumentsComponent;
    let fixture: ComponentFixture<DocumentsComponent>;

    const mockImages: ImageInformationDto[] = [
        {
            uuid: '1',
            url: 'http://url/api/v1/1',
            sender: 'testSender',
            receiver: 'testReceiver',
            creationDate: new Date(),
            lastModified: new Date(),
            analysisStatus: AnalysisStatus.IN_PROGRESS,
            documentType: DocumentTypeId.CMR,
            image_analysis_result: new ErrorSchemaDto('status', 'message', 'error_details'),
        },
    ];

    const matDialogMock: jest.Mocked<MatDialog> = {
        open: jest.fn(),
    } as never;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [],
            imports: [DocumentsComponent, BrowserAnimationsModule],
            providers: [
                ImageService,
                { provide: MatDialog, useValue: matDialogMock },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of('1'),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DocumentsComponent);
        component = fixture.componentInstance;
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
});
