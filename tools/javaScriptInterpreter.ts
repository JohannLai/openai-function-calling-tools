import { z } from "zod";
import { VM } from "vm2";
import { Tool } from "./tool";

function createJavaScriptInterpreter() {
  const paramsSchema = z.object({
    code: z.string(),
  });
  const name = "javaScriptInterpreter";
  const description = "Useful for running JavaScript code in sandbox. Input is a string of JavaScript code, output is the result of the code.";

  const execute = (params: z.infer<typeof paramsSchema>) => {
    const { code } = params;
    const vm = new VM({
      timeout: 5000,
      sandbox: {},
    });
    try {
      return vm.run(code);
    } catch (error) {
      return `Failed to execute script: ${error.message}`;
    }
  };

  return new Tool<typeof paramsSchema, z.ZodType<any, any>>(paramsSchema, name, description, execute).tool;
}

export { createJavaScriptInterpreter };
