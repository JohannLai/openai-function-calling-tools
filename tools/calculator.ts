// calculator.ts
import { Parser } from "expr-eval";

class Calculator {
  calculatorSchema = {
    name: "calculator",
    description: "Useful for getting the result of a math expression. ",
    parameters: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "a valid mathematical expression that could be executed by a simple calculator",
        },
      },
    },
  };

  calculator = (expression: string) => {
    const parser = new Parser();
    try {
      const result = parser.parse(expression).evaluate();
      return result;
    } catch (error) {
      return "Error";
    }
  };
}

export {
  Calculator
};