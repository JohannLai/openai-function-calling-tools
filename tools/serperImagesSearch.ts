import { Tool } from './tool';
import { z } from 'zod';

function createSerperImagesSearch({ apiKey }: { apiKey: string }) {
  if (!apiKey) {
    throw new Error('Serper key must be set.');
  }

  const paramsSchema = z.object({
    input: z.string(),
  });
  const name = 'serperImagesSearch';
  const description = 'Useful for searching images. Input should be a search query. Outputs a JSON array of image results.';

  const execute = async ({ input }: z.infer<typeof paramsSchema>) => {
    try {
      const res = await fetch(
        'https://google.serper.dev/images',
        {
          method: 'POST',
          headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ q: input })
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      const results =
        data.images?.map((item: any) => ({
          title: item.title,
          imageUrl: item.imageUrl,
          imageWidth: item.imageWidth,
          imageHeight: item.imageHeight,
        })) ?? [];
      return JSON.stringify(results);
    } catch (error) {
      throw new Error(`Error in SerperImagesSearch: ${error}`);
    }
  };

  return new Tool(paramsSchema, name, description, execute).tool;
}

export { createSerperImagesSearch };
