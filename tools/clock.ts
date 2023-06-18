import moment from 'moment-timezone';

class Clock {
  clockSchema = {
    name: "clock",
    description: "Useful for getting the current Date and time, Format is'YYYY-MM-DD HH:mm:ss Z', if you don't know the time now, you can use this tool to get the current time.",
    parameters: {
      type: "object",
      properties: {
        timeZone: {
          type: "string",
          description: "The timeZone to use for the clock. Defaults to 'America/New_York'. empty string will return current time.",
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
