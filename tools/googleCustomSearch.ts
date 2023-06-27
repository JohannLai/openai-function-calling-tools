import { Tool } from './tool';
import { z } from 'zod';

function createGoogleCustomSearch({ apiKey, googleCSEId }: { apiKey: string; googleCSEId: string }) {
  if (!apiKey || !googleCSEId) {
    throw new Error('Google API key and custom search engine id must be set.');
  }

  const paramsSchema = z.object({
    input: z.string(),
  });
  const name = 'googleCustomSearch';
  const description = 'A custom search engine. Useful for when you need to answer questions about current events. Input should be a search query. Outputs a JSON array of results.';

  const execute = async ({ input }: z.infer<typeof paramsSchema>) => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${googleCSEId}&q=${encodeURIComponent(
          input
        )}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      const results =
        data.items?.map((item: { title?: string; link?: string; snippet?: string }) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
        })) ?? [];
      return JSON.stringify(results);
    } catch (error) {
      throw new Error(`Error in GoogleCustomSearch: ${error}`);
    }
  };

  return new Tool(paramsSchema, name, description, execute).tool;
}

export { createGoogleCustomSearch };
