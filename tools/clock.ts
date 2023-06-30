// clock.ts
import moment from 'moment-timezone';
import { Tool, ToolInterface } from './tool';
import { z } from 'zod';

function createClock() {
  const paramsSchema = z.object({
    timeZone: z.string().optional(),
  })
  const name = 'clock';
  const description = "Useful for getting the current Date and time, Format is'YYYY-MM-DD HH:mm:ss Z', if you don't know the time now, you can use this tool to get the current time.";

  const execute = ({ timeZone }: z.infer<typeof paramsSchema>) => {
    if (!timeZone) {
      const currentTime = moment().format('YYYY-MM-DD HH:mm:ss Z');
      return currentTime;
    } else {
      const currentTime = moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss Z');
      return currentTime;
    }
  };

  return new Tool<typeof paramsSchema, z.ZodType<string, any>>(paramsSchema, name, description, execute).tool;
}

export { createClock };
