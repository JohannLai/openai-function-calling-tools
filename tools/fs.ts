import { z } from "zod";

abstract class BaseFileStore {
  abstract readFile(filePath: string): Promise<string>;
  abstract writeFile(filePath: string, text: string): Promise<void>;
}

class ReadFileTool {
  readFileToolSchema = {
    name: "read_file",
    description: "Read file from disk",
    parameters: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "file path to read from",
        },
      },
    },
  };

  store: BaseFileStore;

  constructor(store: BaseFileStore) {
    this.store = store;
  }

  async call({ file_path }: { file_path: string }) {
    return await this.store.readFile(file_path);
  }
}

export { ReadFileTool };

class WriteFileTool {
  writeFileToolSchema = {
    name: "write_file",
    description: "Write file to disk",
    parameters: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "file path to write to",
        },
        text: {
          type: "string",
          description: "text to write to file",
        },
      },
    },
  };

  store: BaseFileStore;

  constructor(store: BaseFileStore) {
    this.store = store;
  }

  async call({ file_path, text }: { file_path: string; text: string }) {
    await this.store.writeFile(file_path, text);
    return "File written to successfully.";
  }
}

export { WriteFileTool };
