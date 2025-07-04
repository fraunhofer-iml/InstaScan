/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from './SnackBar.Service';

describe('SnackbarService (with Jest)', () => {
  let service: SnackbarService;
  let snackBarMock: jest.Mocked<MatSnackBar>;

  beforeEach(() => {
    snackBarMock = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatSnackBar>;

    service = new SnackbarService(snackBarMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call snackBar.open with correct arguments when showSnackbar is called', () => {
    const message = 'Test Message';

    service.showSnackbar(message);

    expect(snackBarMock.open).toHaveBeenCalledWith(message, 'close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  });

  it('should emit message via getMessages()', (done) => {
    const testMessage = 'Observable Message';

    service.getMessages().subscribe((msg:string) => {
      expect(msg).toBe(testMessage);
      done();
    });

    service.sendMessage(testMessage);
  });

  it('should call showSnackbar when sendMessage is called', () => {
    const spy = jest.spyOn(service, 'showSnackbar');
    const message = 'Send Message';

    service.sendMessage(message);

    expect(spy).toHaveBeenCalledWith(message);
  });
});
