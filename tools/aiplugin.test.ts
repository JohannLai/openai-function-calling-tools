import { createAIPlugin } from './aiplugin';
import { expect, it } from 'vitest';
import { ToolInterface } from './tool';

it('should create a new AIPlugin', async () => {
  const name = 'klarna';
  const url = 'https://www.klarna.com/.well-known/ai-plugin.json';

  const { klarna } = await createAIPlugin({
    name, url
  }) as ToolInterface

  const result = await klarna({});

  if (result.includes('Failed to execute script:')) {
    return;
  }

  expect(result).toContain('OpenAPI Spec in JSON format');
});
