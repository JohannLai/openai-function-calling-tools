import { VM } from "vm2";
class JavaScriptInterpreter {
  javaScriptInterpreterSchema = {
    name: "javaScriptInterpreter",
    description: "Useful for running JavaScript code in sandbox. Input is a string of JavaScript code, output is the result of the code.",
    parameters: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The JavaScript code to run.",
        },
      }
    }
  };

  javaScriptInterpreter = (code: string) => {
    const vm = new VM({
      timeout: 5000,
      sandbox: {},
    });
    const result = vm.run(code);
    return result;
  };
}

export {
  JavaScriptInterpreter
};
