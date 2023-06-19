const { Configuration, OpenAIApi } = require("openai");
const { JavaScriptInterpreter } = require("../dist/index.js");

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

  const { javaScriptInterpreter, javaScriptInterpreterSchema } =
    new JavaScriptInterpreter();

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
  let response = await getCompletion(messages);

  if (response.data.choices[0].finish_reason === "stop") {
    console.log("\n\n", response.data.choices[0].message.content);
  } else if (response.data.choices[0].finish_reason === "function_call") {
    const fnName = response.data.choices[0].message.function_call.name;
    const args = response.data.choices[0].message.function_call.arguments;

    console.log("Function call: " + fnName);
    console.log("Arguments: " + args);

    // call the function
    const fn = functions[fnName];
    const result = fn(...Object.values(JSON.parse(args)));

    console.log("Calling Function Result: " + result);

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

    // call the completion again
    response = await getCompletion(messages);

    console.log(response.data.choices[0].message.content);
  }
};

main();
