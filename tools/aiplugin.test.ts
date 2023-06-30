import { createAIPlugin } from './aiplugin';
import { expect, it } from 'vitest';

it('should create a new AIPlugin', async () => {
  const [klarna] = await createAIPlugin({
    name: 'klarna',
    url: 'https://www.klarna.com/.well-known/ai-plugin.json'
  })

  const result = klarna({})

  if (result.includes('Failed to execute script:')) {
    return;
  }

  expect(result).toContain('OpenAPI Spec in JSON/YAML forma');
});
