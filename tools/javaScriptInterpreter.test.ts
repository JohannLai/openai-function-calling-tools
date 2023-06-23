import { createJavaScriptInterpreter } from "./javaScriptInterpreter";
import { expect, it } from 'vitest';

it('should interpret JavaScript code correctly', () => {
  const interpreter = createJavaScriptInterpreter();
  const result = interpreter.javaScriptInterpreter({
    code: `
    1 + 1
    `,
  });
  expect(result).toBe(2);
});

it('should timeout for long running scripts', () => {
  const interpreter = createJavaScriptInterpreter();
  const result = interpreter.javaScriptInterpreter({
    code: `
    while (true) {}
    `,
  });

  expect(result).toBe("Failed to execute script: Script execution timed out after 5000ms")
});

it('should not have access to Node.js environment', () => {
  const interpreter = createJavaScriptInterpreter();
  const result = interpreter.javaScriptInterpreter({
    code: `
    process.exit(1)
    `,
  });

  expect(result).toBe("Failed to execute script: process is not defined")
});
