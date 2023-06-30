const { Configuration, OpenAIApi } = require("openai");
const { createJavaScriptInterpreter } = require("../dist/cjs/index.js");

const main = async () => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const QUESTION = "What is 0.1 + 0.2 ?";

  const messages = [
    {
      role: "user",
      content: QUESTION,
    },
  ];

  const [javaScriptInterpreter, javaScriptInterpreterSchema] =
    new createJavaScriptInterpreter();

  const functions = {
    javaScriptInterpreter,
  };

  const getCompletion = async (messages) => {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages,
      functions: [javaScriptInterpreterSchema],
      temperature: 0,
    });

    return response;
  };

  console.log("\n\nQuestion: " + QUESTION);
  let response;
  while (true) {
    response = await getCompletion(messages);
    const { finish_reason, message } = response.data.choices[0];

    if (finish_reason === "stop") {
      console.log(message.content);
      break;
    } else if (finish_reason === "function_call") {
      const fnName = message.function_call.name;
      const args = message.function_call.arguments;

      const fn = functions[fnName];
      const result = await fn(JSON.parse(args));
      // console parameters
      console.log(`Function call: ${fnName}, Arguments: ${args}`);
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
