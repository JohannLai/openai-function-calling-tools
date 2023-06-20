import { JavaScriptInterpreter } from "./javaScriptInterpreter";
import { expect, it } from 'vitest';

it('should interpret JavaScript code correctly', () => {
  const interpreter = new JavaScriptInterpreter();
  const result = interpreter.javaScriptInterpreter('1 + 1');
  expect(result).toBe(2);
});

it('should timeout for long running scripts', () => {
  const interpreter = new JavaScriptInterpreter();
  expect(() => {
    interpreter.javaScriptInterpreter('while(true) {}');
  }).toThrow();
});

it('should not have access to Node.js environment', () => {
  const interpreter = new JavaScriptInterpreter();
  expect(() => {
    interpreter.javaScriptInterpreter('process');
  }).toThrow();
});
