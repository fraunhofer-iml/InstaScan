/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    AfterViewInit,
    Component,
    ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ImageInformationDto } from '@ap4/api';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ImageService } from '../../shared/services/image/imageService';
import { HttpClientModule } from '@angular/common/http';
import { map, Subject } from 'rxjs';
import { DISPLAYED_COLUMNS } from './const/displayed-columns.const';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ScanComponent } from './scan/scan.component';
import { MatDialog } from '@angular/material/dialog';
import { UploadComponent } from './upload/upload.component';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatTableModule,
        HttpClientModule,
        RouterModule,
        MatPaginator,
        ScanComponent,
        MatSortModule,
    ],
    providers: [ImageService],
    templateUrl: './documents.component.html',
    styleUrl: './documents.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsComponent implements AfterViewInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource$ = new Subject<MatTableDataSource<ImageInformationDto>>();
    displayedColumns: string[] = DISPLAYED_COLUMNS;

    constructor(
        private readonly imageService: ImageService,
        private readonly dialog: MatDialog,
        private readonly cdr: ChangeDetectorRef
    ) {
        this.initializeDataSource();
    }

    ngAfterViewInit(): void {
        this.initializeDataSource();
    }

    transformStatus(value: string): string {
        if (!value) return value;
        return value.replace(/_/g, ' ').toLowerCase();
    }

    openUploadDocument() {
        const dialogRef = this.dialog.open(UploadComponent, {
            panelClass: 'mat-dialog-container',
            width: '600px',
            height: '400px',
        });

        dialogRef.afterClosed().subscribe(() => {
            this.initializeDataSource();
        });
    }

    initializeDataSource(): void {
        this.imageService
            .getImages()
            .pipe(
                map((images) => {
                    images.reverse();
                    const dataSource =
                        new MatTableDataSource<ImageInformationDto>(images);
                    this.setupPaginator(dataSource);
                    dataSource.sort = this.sort;
                    return dataSource;
                })
            )
            .subscribe((dataSource) => {
                this.dataSource$.next(dataSource);
                this.cdr.markForCheck();
            });
    }

    private setupPaginator(
        dataSource: MatTableDataSource<ImageInformationDto>
    ): void {
        this.paginator.pageSize = Number(localStorage.getItem('itemsPerPage'));
        dataSource.paginator = this.paginator;
        this.paginator.page.subscribe((event: PageEvent) => {
            localStorage.setItem('itemsPerPage', String(event.pageSize));
        });
    }
}
