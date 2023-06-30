const { Configuration, OpenAIApi } = require("openai");
const {
  createGoogleCustomSearch,
  createClock,
} = require("../dist/cjs/index.js");

const main = async () => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const QUESTION =
    "How many tesla model 3 sale in last year? You should get the year first. And then get the tesla model 3 sale number.";

  const messages = [
    {
      role: "user",
      content: QUESTION,
    },
  ];

  const [googleCustomSearch, googleCustomSearchSchema] =
    createGoogleCustomSearch({
      apiKey: process.env.GOOGLE_API_KEY,
      googleCSEId: process.env.GOOGLE_CSE_ID,
    });

  const [clock, clockSchema] = createClock();

  const functions = {
    googleCustomSearch,
    clock,
  };

  const getCompletion = async (messages) => {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages,
      functions: [googleCustomSearchSchema, clockSchema],
      temperature: 0,
    });

    return response;
  };

  let response;

  console.log("Question: " + QUESTION);

  while (true) {
    response = await getCompletion(messages);

    if (response.data.choices[0].finish_reason === "stop") {
      console.log("\n\n", response.data.choices[0].message.content);
      break;
    } else if (response.data.choices[0].finish_reason === "function_call") {
      const fnName = response.data.choices[0].message.function_call.name;
      const args = response.data.choices[0].message.function_call.arguments;

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
