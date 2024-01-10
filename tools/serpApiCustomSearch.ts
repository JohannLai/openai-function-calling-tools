import { Tool } from './tool';
import { z } from 'zod';

function createSerpApiCustomSearch({ apiKey }: { apiKey: string }) {
  if (!apiKey) {
    throw new Error('SerpApi key must be set.');
  }

  const paramsSchema = z.object({
    input: z.string(),
  });
  const name = 'serpApiCustomSearch';
  const description = 'SerpApi search engine. Input should be a search query. Outputs a JSON array of results.';

  const execute = async ({ input }: z.infer<typeof paramsSchema>) => {
    try {
      const res = await fetch(
        `https://serpapi.com/search?api_key=${apiKey}&engine=google&q=${encodeURIComponent(input)}&google_domain=google.com`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      const results =
        data.organic_results?.map((item: any) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
        })) ?? [];
      return JSON.stringify(results);
    } catch (error) {
      throw new Error(`Error in SerpApiCustomSearch: ${error}`);
    }
  };

  return new Tool(paramsSchema, name, description, execute).tool;
}

export { createSerpApiCustomSearch };
