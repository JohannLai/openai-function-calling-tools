import { Clock } from './clock';
import { expect, it } from 'vitest';

it('should return current time', () => {
  const currentTime = new Date();
  const year = currentTime.getFullYear();
  const month = ("0" + (currentTime.getMonth() + 1)).slice(-2); // Months are 0 based in JS
  const date = ("0" + currentTime.getDate()).slice(-2);
  const hours = ("0" + currentTime.getHours()).slice(-2);
  const minutes = ("0" + currentTime.getMinutes()).slice(-2);
  const seconds = ("0" + currentTime.getSeconds()).slice(-2);
  const expectedTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  const { clock } = new Clock();

  expect(clock()).toEqual(expectedTime);
});