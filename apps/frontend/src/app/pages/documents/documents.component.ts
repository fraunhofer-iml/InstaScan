/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ImageInformationDto } from '@ap4/api';
import { AnalysisStatus } from '@ap4/utils';
import { BehaviorSubject, map, startWith, Subject, tap } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { DialogDeleteDocumentComponent } from '../../layout/delete-document-dialog/delete-document-dialog.component';
import { ImageService } from '../../shared/services/image/imageService';
import { ImageStreamService } from '../../shared/services/socket/image-stream.service';
import { DATETIME } from './const/date-time.const';
import { DISPLAYED_COLUMNS } from './const/displayed-columns.const';
import { STATUS_ICONS_MAP } from './const/status-icons-map.const';
import { ScanComponent } from './scan/scan.component';

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
    MatSortModule,
    MatIcon,
    ScanComponent,
    MatFormField,
    MatInput,
  ],
  providers: [ImageService, ImageStreamService, DatePipe],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource$ = new Subject<MatTableDataSource<ImageInformationDto>>();
  filterValue$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  displayedColumns: string[] = DISPLAYED_COLUMNS;
  constructor(
    private readonly imageService: ImageService,
    private readonly imageStreamService: ImageStreamService,
    private readonly cdr: ChangeDetectorRef,
    private readonly datePipe: DatePipe,
    private readonly dialog: MatDialog
  ) {
    this.initializeDataSource();
  }

  /**
   * Lifecycle hook called after the component's view has been fully initialized.
   */
  ngAfterViewInit(): void {
    this.initializeDataSource();
    this.imageStreamService.connect();
    this.imageStreamService
      .getUpdates()
      .pipe(startWith(null))
      .subscribe(() => {
        this.initializeDataSource();
      });
  }

  /**
   * Transforms backend status code into human-readable strings.
   * @param value The raw status value from the backend.
   * @returns A formatted string representing the document's status.
   */
  transformStatus(value: string): string {
    if (!value) return value;
    return value.replace(/_/g, ' ').toLowerCase();
  }

  /**
   * Initializes the document table data source.
   */
  initializeDataSource(): void {
    this.imageService
      .getImages()
      .pipe(
        map((images) => {
          const filteredImages = images.filter((image) => image.analysisStatus !== AnalysisStatus.PENDING);
          const dataSource = new MatTableDataSource<ImageInformationDto>(filteredImages.reverse());
          this.setupPaginator(dataSource);
          this.setFilterPredicate(dataSource);
          dataSource.sort = this.sort;
          return dataSource;
        }),
        tap((dataSource) => {
          this.filterValue$.subscribe((filter: string) => (dataSource.filter = filter));
        })
      )
      .subscribe((dataSource) => {
        this.cdr.detectChanges();
        this.dataSource$.next(dataSource);
      });
  }

  /**
   * Applies a user-entered filter to the data source.
   * @param event The input event from the filter field.
   */
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue$.next(value);
  }

  /**
   * Deletes an image and updates the displayed document list.
   * @param uuid The unique ID of the image to delete.
   */
  deleteImage(uuid: string) {
    const dialogRef = this.dialog.open(DialogDeleteDocumentComponent);

    dialogRef.afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.imageService.deleteImage(uuid).subscribe(() => {
          this.initializeDataSource();
        });
      }
    });
  }

  /**
   * Return a corresponding icon name or path based on the document's analysis status.
   * @param analysisStatus The analysis status string.
   * @returns The icon name.
   */
  getStatusIcon(analysisStatus: string) {
    return STATUS_ICONS_MAP[analysisStatus as AnalysisStatus] || '';
  }

  /**
   * Configures the paginator for the material data table.
   * @param dataSource The data source to attach to the paginator
   */
  private setupPaginator(dataSource: MatTableDataSource<ImageInformationDto>): void {
    this.paginator.pageSize = Number(localStorage.getItem('itemsPerPage'));
    dataSource.paginator = this.paginator;
    this.paginator.page.subscribe((event: PageEvent) => {
      localStorage.setItem('itemsPerPage', String(event.pageSize));
    });
  }

  /**
   * Defines a custom filtering function for the table data source.
   * @param dataSource The data source to configure,
   */
  private setFilterPredicate(dataSource: MatTableDataSource<ImageInformationDto>): void {
    dataSource.filterPredicate = (image: ImageInformationDto, value: string): boolean => {
      return (
        (image.uuid || '').toLowerCase().includes(value) ||
        (image.bundleId || '').toLowerCase().includes(value) ||
        (image.documentType || '').toLowerCase().includes(value) ||
        (image.sender || '').toLowerCase().includes(value) ||
        (image.receiver || '').toLowerCase().includes(value) ||
        (image.analysisStatus || '').toLowerCase().includes(value) ||
        this.formatDate(image.creationDate).includes(value) ||
        this.formatDate(image.lastModified).includes(value)
      );
    };
  }

  /**
   * Formats a data object into a user-friendly string,
   * @param date the data to format.
   * @returns A formatted data string.
   */
  private formatDate(date: Date): string {
    return (this.datePipe.transform(date, DATETIME) ?? '').toLowerCase();
  }
}
