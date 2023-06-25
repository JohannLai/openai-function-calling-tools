import axios from 'axios';
import { Tool } from './tool';
import { z } from 'zod';

function createRequest() {
  const paramsSchema = z.object({
    url: z.string(),
    method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
    data: z.record(z.any()).optional(),
    headers: z.record(z.string()).optional(),
  });
  const name = 'request';
  const description = 'useful for sending http requests. Input is a url, method, data, headers, output is the result of the request.';

  const execute = async ({ url, method, data, headers }: z.infer<typeof paramsSchema>) => {
    try {
      const res = await axios({
        url,
        method,
        data,
        headers,
      });

      return res.data;
    } catch (error) {
      return `Failed to execute script: ${error.message}`;
    }
  };

  return new Tool(paramsSchema, name, description, execute).tool;
}

export { createRequest };
