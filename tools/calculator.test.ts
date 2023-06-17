// calculator.test.ts
import { Calculator } from './calculator';
import { expect, it } from 'vitest';

it('should return the result of a given expression', () => {
  const calculator = new Calculator();
  expect(calculator.calculator('2 + 2')).toBe(4);
  expect(calculator.calculator('2 * 2')).toBe(4);
  expect(calculator.calculator('2 / 2')).toBe(1);
  expect(calculator.calculator('2 - 2')).toBe(0);
});

it('should return "Error" if the expression is invalid', () => {
  const calculator = new Calculator();
  expect(calculator.calculator('2 +')).toBe('Error');
  expect(calculator.calculator('2 *')).toBe('Error');
  expect(calculator.calculator('abc')).toBe('Error');
});