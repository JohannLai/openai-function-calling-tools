const { Configuration, OpenAIApi } = require("openai");
const { createAIPlugin, createRequest } = require("../dist/cjs/index.js");

const main = async () => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const QUESTION = `
    What is the weather in New York?

    2 steps:
    1. get the open api spec from webSearch
    2. call the request function
    `;

  const messages = [
    {
      role: "user",
      content: QUESTION,
    },
  ];

  const [request, requestSchema] = createRequest();
  const [websearch, websearchSchema] = await createAIPlugin({
    name: "websearch",
    url: "https://websearch.plugsugar.com/.well-known/ai-plugin.json",
  });

  const functions = {
    request,
    websearch,
  };

  const getCompletion = async (messages) => {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages,
      functions: [websearchSchema, requestSchema],
      temperature: 0,
    });

    return response;
  };
  let response;

  console.log("Question: " + QUESTION);

  while (true) {
    response = await getCompletion(messages);

    if (response.data.choices[0].finish_reason === "stop") {
      console.log("\n\n\n" + response.data.choices[0].message.content);
      break;
    } else if (response.data.choices[0].finish_reason === "function_call") {
      const fnName = response.data.choices[0].message.function_call.name;
      const args = response.data.choices[0].message.function_call.arguments;

      console.log(`Function call: ${fnName}, Arguments: ${args}`);
      const fn = functions[fnName];
      const result = await fn(JSON.parse(args));
      // console parameters
      console.log(
        `Calling Function ${fnName} Result: ` +
          JSON.stringify({ result: result })
      );

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
