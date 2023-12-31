import { createRequest } from './request'; // 根据文件路径更改
import { expect, it } from 'vitest';

const [request] = createRequest();

it('should successfully send a GET request', async () => {
  const result = await request({
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    method: 'GET',
  });

  // if in CI github actions, the result will be 403
  if (result === 'Failed to execute script: Request failed with status code 403') {
    return;
  }

  expect(result).toMatchObject({
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false,
  });
});

it('should handle failed requests', async () => {
  const result = await request({
    url: 'https://not-a-real-url-123456.com',
    method: 'GET',
  });

  expect(result).toContain('Failed to execute script:');
});
