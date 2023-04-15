import { OpenAI } from "langchain";
import { initializeAgentExecutor } from "langchain/agents";
import { Calculator } from "langchain/tools";
import { ScaleSerp } from "../tools/scaleserp";

export async function runApp2() {
  console.log(process.env.SCALESERP_API_KEY);
  
  const model = new OpenAI({ temperature: 0 });
  const tools = [
    new ScaleSerp(process.env.SERPAPI_API_KEY, {
      // location: "Austin,Texas,United States",
      hl: "en",
      gl: "us",
    }),
    new Calculator(),
  ];

  const executor = await initializeAgentExecutor(
    tools,
    model,
    "zero-shot-react-description"
  );
  console.log("Loaded agent.");

  const input =
    "Who is king Willem Alexander wife?" +
    " What is her current age raised to the 0.23 power?";
  console.log(`Executing with input "${input}"...`);

  const result = await executor.call({ input });

  console.log(`Got output ${result.output}`);
}
