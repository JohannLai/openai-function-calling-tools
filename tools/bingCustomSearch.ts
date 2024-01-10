import { Tool } from './tool';
import { z } from 'zod';

function createBingCustomSearch({ apiKey }: { apiKey: string }) {
  if (!apiKey) {
    throw new Error('Bing API key must be set.');
  }

  const paramsSchema = z.object({
    input: z.string(),
  });
  const name = 'bingCustomSearch';
  const description = 'Bing search engine. Input should be a search query. Outputs a JSON array of results.';

  const execute = async ({ input }: z.infer<typeof paramsSchema>) => {
    try {
      const res = await fetch(
        `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(input)}`,
        {
          headers: { "Ocp-Apim-Subscription-Key": apiKey }
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      const results =
        data.webPages?.value.map((item: any) => ({
          title: item.name,
          link: item.url,
          snippet: item.snippet,
        })) ?? [];
      return JSON.stringify(results);
    } catch (error) {
      throw new Error(`Error in BingCustomSearch: ${error}`);
    }
  };

  return new Tool(paramsSchema, name, description, execute).tool;
}

export { createBingCustomSearch };
