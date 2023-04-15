import * as dotenv from "dotenv";
import { runApp1 } from "./app1";
import { runApp2 } from "./app2";

async function main() {
  await runApp1();
  await runApp2();
}

dotenv.config();
main();
