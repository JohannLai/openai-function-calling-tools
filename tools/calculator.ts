import { Parser } from "expr-eval";
import { z } from "zod";
import { Tool } from "./tool";

function createCalculator() {
  const paramsSchema = z.object({
    expression: z.string(),
  });
  const name = "calculator";
  const description = "Useful for getting the result of a math expression. Input is a string of a math expression, output is the result of the expression.";

  const execute = (params: z.infer<typeof paramsSchema>) => {
    const { expression } = params;

    const parser = new Parser();
    try {
      const result = parser.parse(expression).evaluate();
      return result;
    } catch (error) {
      return `Failed to execute script: ${error.message}`;
    }
  };

  return new Tool(paramsSchema, name, description, execute).tool;
}

export { createCalculator };