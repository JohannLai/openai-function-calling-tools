import { Clock } from './clock';
import { expect, it } from 'vitest';
import moment from 'moment-timezone';

it('should return current time', () => {
  const expectedTime = moment().format('YYYY-MM-DD HH:mm:ss Z');
  const { clock } = new Clock();

  expect(clock()).toEqual(expectedTime);
});

it('should return current time in a given timezone', () => {
  const expectedTime = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss Z');
  const { clock } = new Clock();

  expect(clock('America/New_York')).toEqual(expectedTime);
});
