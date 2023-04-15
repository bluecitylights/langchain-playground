import * as dotenv from "dotenv";
import { OpenAI } from "langchain";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

dotenv.config();

// const model = new OpenAI({
//   modelName: "gpt-3.5-turbo",
//   openAIApiKey: process.env.OPENAI_API_KEY,
//   temperature: 0.9,
// });

// const res = await model.call(
//   "What's a good idea for an application to build with GPT-3?"
// );

// console.log(res);

const model = new OpenAI({ temperature: 0.9 });

const template = "What is a good name for a company that makes {product}?";
const prompt = new PromptTemplate({
  template: template,
  inputVariables: ["product"],
});
console.log(prompt);

const prompt_res = await prompt.format({ product: "colorful socks" });
console.log(prompt_res);

const chain = new LLMChain({ llm: model, prompt: prompt });
const res = await chain.call({ product: "colorful socks" });
console.log(res);
