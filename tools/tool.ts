import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export type ToolInterface<P extends z.ZodType<any, any>, R extends z.ZodType<any, any>> = [
  (params: z.infer<P>) => z.infer<R>,
  {
    name: string;
    description: string;
    parameters: object;
  }
];

class Tool<P extends z.ZodType<any, any>, R extends z.ZodType<any, any>> {
  paramsSchema: P;
  name: string;
  description: string;
  execute: (params: z.infer<P>) => z.infer<R>;
  tool: ToolInterface<P, R>

  constructor(paramsSchema: P, name: string, description: string, execute: (params: z.infer<P>) => z.infer<R>) {
    this.paramsSchema = paramsSchema;
    this.name = name;
    this.description = description;
    this.execute = execute;

    this.tool = [
      this.run.bind(this),
      {
        name: this.name,
        description: this.description,
        parameters: zodToJsonSchema(this.paramsSchema),
      }
    ];
  }

  run(params: z.infer<P>): z.infer<R> {
    try {
      const validatedParams = this.paramsSchema.parse(params);
      return this.execute(validatedParams);
    } catch (error) {
      return error.message as z.infer<R>;
    }
  }
}

export { Tool };
