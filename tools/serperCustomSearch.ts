import { Tool } from './tool';
import { z } from 'zod';

function createSerperCustomSearch({ apiKey }: { apiKey: string }) {
  if (!apiKey) {
    throw new Error('Serper key must be set.');
  }

  const paramsSchema = z.object({
    input: z.string(),
  });
  const name = 'serperCustomSearch';
  const description = 'Serper search engine. Input should be a search query. Outputs a JSON array of results.';

  const execute = async ({ input }: z.infer<typeof paramsSchema>) => {
    try {
      const res = await fetch(
        'https://google.serper.dev/search',
        {
          method: 'POST',
          headers: { 
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ q: input, gl: "cn", hl: "zh-cn" })
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      const results =
        data.organic?.map((item: any) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
        })) ?? [];
      return JSON.stringify(results);
    } catch (error) {
      throw new Error(`Error in SerperCustomSearch: ${error}`);
    }
  };

  return new Tool(paramsSchema, name, description, execute).tool;
}

export { createSerperCustomSearch };
