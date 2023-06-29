const { Configuration, OpenAIApi } = require("openai");
const { createWebBrowser, createClock } = require("../dist/cjs/index.js");

const main = async () => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const QUESTION = `
    summarize: https://www.bbc.com/news/world-europe-66049705
`;

  const messages = [
    {
      role: "user",
      content: QUESTION,
    },
  ];

  const { webbrowser, webbrowserSchema } = createWebBrowser();

  const { clock, clockSchema } = createClock();

  const functions = {
    webbrowser,
    clock,
  };

  const getCompletion = async (messages) => {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      messages,
      functions: [webbrowserSchema, clockSchema],
      temperature: 0,
    });

    return response;
  };
  let response;

  console.log("Question: " + QUESTION);

  while (true) {
    response = await getCompletion(messages);

    if (response.data.choices[0].finish_reason === "stop") {
      console.log(response.data.choices[0].message.content);
      break;
    } else if (response.data.choices[0].finish_reason === "function_call") {
      const fnName = response.data.choices[0].message.function_call.name;
      const args = response.data.choices[0].message.function_call.arguments;

      // console parameters
      console.log(`Function call: ${fnName}, Arguments: ${args}`);

      const fn = functions[fnName];
      const result = await fn(JSON.parse(args));

      console.log(`Calling Function ${fnName} Result: ` + result);

      messages.push({
        role: "assistant",
        content: null,
        function_call: {
          name: fnName,
          arguments: args,
        },
      });

      messages.push({
        role: "function",
        name: fnName,
        content: JSON.stringify({ result: result }),
      });
    }
  }
};

main();
