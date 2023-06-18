import moment from 'moment-timezone';

class Clock {
  clockSchema = {
    name: "clock",
    description: "Useful for getting the current time and timeZone. Format is'YYYY-MM-DD HH:mm:ss Z', you should confirm the zone is correct.",
    parameters: {
      type: "object",
      properties: {
        timeZone: {
          type: "string",
          description: "The timeZone to use for the clock. Defaults to 'America/New_York'.",
        },
      }
    }
  };

  clock = (timeZone?: string) => {
    if (!timeZone) {
      const currentTime = moment().format('YYYY-MM-DD HH:mm:ss Z');
      return currentTime;
    }else{
      const currentTime = moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss Z');
      return currentTime;
    }
  };
}

export {
  Clock
};
