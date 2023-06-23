import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { VM } from "vm2";

class Tool {
  paramsSchema: z.ZodObject<any>;
  name: string;
  description: string;
  execute: (params: any) => any;
  tool: any;

  constructor(paramsSchema: z.ZodObject<any>, name: string, description: string, execute: (params: any) => any) {
    this.paramsSchema = paramsSchema;
    this.name = name;
    this.description = description;
    this.execute = execute;

    this.tool = {
      [name]: this.run.bind(this),
      [`${name}Schema`]: this.getSchema(),
    };
  }

  getSchema() {
    return {
      name: this.name,
      description: this.description,
      parameters: zodToJsonSchema(this.paramsSchema),
    };
  }

  run(params: any) {
    try {
      const validatedParams = this.paramsSchema.parse(params);
      return this.execute(validatedParams);
    } catch (error) {
      return error.message;
    }
  }
}

export { Tool };
