import { Tool } from './tool';
import { z } from 'zod';

interface AIPluginRes {
  name_for_human: string;
  name_for_model: string;
  description_for_human: string;
  description_for_model: string;
  api: {
    url: string;
  }
}

async function createAIPlugin({
  name,
  url,
}: {
  name: string,
  url: string,
}) {
  const paramsSchema = z.object({});

  const aiPluginResRes = await fetch(url);
  if (!aiPluginResRes.ok) {
    throw new Error(`HTTP error! status: ${aiPluginResRes.status}`);
  }
  const aiPluginRes = await aiPluginResRes.json() as AIPluginRes;

  const apiUrlResRes = await fetch(aiPluginRes.api.url);
  if (!apiUrlResRes.ok) {
    throw new Error(`Failed to execute script: ${apiUrlResRes.status}`); // 修改这里
  }
  const apiUrlRes = await apiUrlResRes.text();

  const execute = ({ }: z.infer<typeof paramsSchema>) => {
    return `
  OpenAPI Spec in JSON/YAML format:\n\n ${apiUrlRes}
  \n\n
  
  ATTENTION: Not the actual data! Just the OpenAPI Spec!
  If you want to get the actual data, 2 steps are required:
  1. Find the API you want to use in the OpenAPI Spec.
  2. generate a client for this API.
  `
  }

  const description = `Call this tool to get the Open API specfor interacting
with the ${aiPluginRes.name_for_human} API, But not the actual data!

JUST THE OPEN API SPEC!

If you want to get the actual data, 2 steps are required:
1. Find the API you want to use in the OpenAPI Spec.
2. generate a client for this API.
`;

  return new Tool<typeof paramsSchema, z.ZodType<string, any>>(paramsSchema, name, description, execute).tool;
}

export { createAIPlugin }
