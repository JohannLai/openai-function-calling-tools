import { Tool } from './tool';
import { z } from 'zod';

function createRequest(baseOption: {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, any>;
  headers?: Record<string, string>;
} = {}) {
  const paramsSchema = z.object({
    url: z.string(),
    method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
    body: z.record(z.any()).optional(),
    headers: z.record(z.string()).optional(),
  });
  const name = 'request';
  const description = `Useful for sending http request.
Use this when you need to get specific content from a url.
Input is a url, method, body, headers, output is the result of the request.
`;

  const execute = async ({ url, method, body, headers }: z.infer<typeof paramsSchema>) => {
    try {
      const res = await fetch(url || baseOption.url!, {
        method: method || baseOption.method!,
        body: JSON.stringify(body || baseOption.body),
        headers: headers || baseOption.headers,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      return `Failed to execute script: ${error.message}`;
    }
  };

  return new Tool<typeof paramsSchema, z.ZodType<Promise<any>, any>>(paramsSchema, name, description, execute).tool;
}

export { createRequest };
