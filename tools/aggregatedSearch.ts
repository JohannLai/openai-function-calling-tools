import { Tool } from './tool';
import { z } from 'zod';
import { createGoogleCustomSearch } from './googleCustomSearch';
import { createBingCustomSearch } from './bingCustomSearch';
import { createSerpApiCustomSearch } from './serpApiCustomSearch';
import { createSerperCustomSearch } from './serperCustomSearch';

function createAggregatedSearchTool({ googleApiKey, googleCSEId, bingApiKey, serpApiApiKey, serperApiKey }: { googleApiKey: string, googleCSEId: string, bingApiKey: string, serpApiApiKey: string, serperApiKey: string }) {
  const paramsSchema = z.object({
    input: z.string(),
  });
  const name = 'aggregatedSearch';
  const description = 'Aggregated search tool. For searching in Google bing and other search engines. Input should be a search query. Outputs a JSON array of results from multiple search engines.';

  const execute = async ({ input }: z.infer<typeof paramsSchema>) => {
    try {
      // Create instances of each search tool
      const [googleCustomSearch] = createGoogleCustomSearch({ apiKey: googleApiKey, googleCSEId });
      const [bingSearch] = createBingCustomSearch({ apiKey: bingApiKey });
      const [serpApiSearch] = createSerpApiCustomSearch({ apiKey: serpApiApiKey });
      const [serperSearch] = createSerperCustomSearch({ apiKey: serperApiKey });

      // Perform all the searches in parallel
      const results = await Promise.all([
        googleCustomSearch({ input }),
        bingSearch({ input }),
        serpApiSearch({ input }),
        serperSearch({ input }),
      ]);

      // Parse the results into a combined object
      const combinedResults = {
        google: JSON.parse(results[0]),
        bing: JSON.parse(results[1]),
        serpApi: JSON.parse(results[2]),
        serper: JSON.parse(results[3]),
      };

      return JSON.stringify(combinedResults);
    } catch (error) {
      throw new Error(`Error in AggregatedSearchTool: ${error}`);
    }
  };

  return new Tool(paramsSchema, name, description, execute).tool;
}

export { createAggregatedSearchTool };
