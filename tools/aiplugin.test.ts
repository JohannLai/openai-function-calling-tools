import { createAIPlugin } from './aiplugin';
import axios from 'axios';
import { expect, it } from 'vitest';

it('should create a new AIPlugin', async () => {
  const name = 'klarna';
  const url = 'https://www.klarna.com/.well-known/ai-plugin.json';

  const { klarna } = await createAIPlugin({
    name, url
  });

  const result = await klarna({});

  console.log(111, result);

  expect(result).toContain('Usage Guide');
});
