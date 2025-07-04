/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JsonComponent } from './json.component';

describe('JsonComponent', () => {
  let component: JsonComponent;
  let fixture: ComponentFixture<JsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(JsonComponent);
    component = fixture.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

//###############################################################################################################################
// Methods like isPrimitive, isObject, and isArray are generic and should handle various types. 
// 'any' allows testing them with any value without TypeScript errors.
//###############################################################################################################################
  describe('isPrimitive', () => {
    it('should return true for null', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(component.isPrimitive(null as any)).toBe(true);
    });

    it('should return true for undefined', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(component.isPrimitive(undefined as any)).toBe(true);
    });

    it('should return true for number', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(component.isPrimitive(42 as any)).toBe(true);
    });

    it('should return false for object', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(component.isPrimitive({} as any)).toBe(false);
    });

    it('should return false for array', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(component.isPrimitive([] as any)).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for a plain object', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(component.isObject({} as any)).toBe(true);
    });

    it('should return false for array', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(component.isObject([] as any)).toBe(false);
    });

    it('should return false for null', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(component.isObject(null as any)).toBe(false);
    });

    it('should return false for a string', () => {
      expect(component.isObject('string')).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should return true for array', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(component.isArray([] as any)).toBe(true);
    });

    it('should return false for object', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(component.isArray({} as any)).toBe(false);
    });

    it('should return false for null', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(component.isArray(null as any)).toBe(false);
    });
  });

  describe('getObjectKeys', () => {
    it('should return keys of an object', () => {
      const obj = { name: 'Alice', age: 30 };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(component.getObjectKeys(obj as any)).toEqual(['name', 'age']);
    });
  });

  describe('formatLabel', () => {
    it('should replace dots with spaces and capitalize each word', () => {
      const input = 'user.name.test';
      const result = component.formatLabel(input);
      expect(result).toBe('User Name Test');
    });
  
    it('should replace special characters with spaces and format properly', () => {
      const input = 'some_key!value*here.test';
      const result = component.formatLabel(input);
      expect(result).toBe('Some Key Value Here Test');
    });
  
    it('should handle mixed cases and punctuation', () => {
      const input = 'myData.Field_name.withSpecial*chars!';
      const result = component.formatLabel(input);
      expect(result).toBe('My Data Field Name With Special Chars');
    });
  
    it('should clean up extra whitespace', () => {
      const input = '   messy__Label  .with...Spaces   ';
      const result = component.formatLabel(input);
      expect(result).toBe('Messy Label With Spaces');
    });
  
    it('should handle single word with no changes needed', () => {
      const input = 'label';
      const result = component.formatLabel(input);
      expect(result).toBe('Label');
    });
  });

  it('should emit modified event when onInputChange is called', () => {
    const spy = jest.spyOn(component.modified, 'emit');
    component.onInputChange(true);
    expect(spy).toHaveBeenCalledWith(true);
  });
});
