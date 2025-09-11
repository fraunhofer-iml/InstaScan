/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {from, Observable, Subscriber, switchMap} from 'rxjs';
import {Injectable} from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import {GlobalWorkerOptions} from 'pdfjs-dist';
import {PDFDocumentProxy, PDFPageProxy} from "pdfjs-dist/types/src/display/api";
import {PageViewport} from "pdfjs-dist/types/src/display/display_utils";

@Injectable()
export class PdfConverter {

  constructor() {
    GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.mjs';
  }

    public convertToPdf(pdfBase64: string): Observable<string> {
        const binaryString: string = window.atob(pdfBase64);
        const pdfBuffer: Uint8Array = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
            pdfBuffer[i] = binaryString.charCodeAt(i);
        }

        return from(pdfjsLib.getDocument({ data: pdfBuffer }).promise).pipe(
            switchMap(pdfDocument => this.getPage(pdfDocument))
        );
    }

    private getPage(pdfDocument: PDFDocumentProxy): Observable<string> {
        return from(pdfDocument.getPage(1)).pipe(
            switchMap(page => this.getCanvas(page as PDFPageProxy))
        );
    }

    private getCanvas(pdfPageProxy: PDFPageProxy): Observable<string> {
        const scale = 2;
        const viewport: PageViewport = pdfPageProxy.getViewport({ scale });
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        return from(pdfPageProxy.render({ canvasContext: context, canvas: canvas, viewport: viewport }).promise).pipe(
            switchMap(() => this.getDataUrl(canvas))
        );
    }

    private getDataUrl(htmlCanvasElement: HTMLCanvasElement): Observable<string> {
        return new Observable<string>((observer: Subscriber<string>) => {
            observer.next(htmlCanvasElement.toDataURL('image/jpeg').split(',')[1]);
            observer.complete();
        });
    }
}
