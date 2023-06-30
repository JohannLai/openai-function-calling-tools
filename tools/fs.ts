import { z } from "zod";
import { Tool } from './tool';

abstract class BaseFileStore {
  abstract readFile(filePath: string): Promise<string>;
  abstract writeFile(filePath: string, text: string): Promise<void>;
}

const readFileParamsSchema = z.object({
  file_path: z.string(),
});

function createReadFileTool(store: BaseFileStore) {
  const name = 'read_file';
  const description = 'Read file from disk';

  const execute = async ({ file_path }: z.infer<typeof readFileParamsSchema>) => {
    return await store.readFile(file_path);
  };

  return new Tool<typeof readFileParamsSchema, z.ZodType<Promise<string>, any>>(readFileParamsSchema, name, description, execute).tool;
}

export { createReadFileTool };

const writeFileParamsSchema = z.object({
  file_path: z.string(),
  text: z.string(),
});

function createWriteFileTool(store: BaseFileStore) {
  const name = 'write_file';
  const description = 'Write file to disk';

  const execute = async ({ file_path, text }: z.infer<typeof writeFileParamsSchema>) => {
    await store.writeFile(file_path, text);
    return "File written to successfully.";
  };

  return new Tool<typeof writeFileParamsSchema, z.ZodType<Promise<string>, any>>(writeFileParamsSchema, name, description, execute).tool;
}

export { createWriteFileTool };
