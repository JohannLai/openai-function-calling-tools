// calculator.test.ts
import { createCalculator } from './calculator';
import { expect, it } from 'vitest';

it('should return the result of a given expression', () => {
  const calculator = createCalculator();
  expect(calculator.calculator({
    expression: '2 + 2',
  })).toBe(4);
});

it('should return "Error" if the expression is invalid', () => {
  const calculator = createCalculator();
  expect(calculator.calculator({
    expression: '2 +',
  })).toBe('Failed to execute script: unexpected TEOF: EOF');

  expect(calculator.calculator({
    a: '2 + 2',
  })).includes('invalid_type');
});
