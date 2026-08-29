import { createProject } from "./create-project.js";
import { parseArgs } from "./parse-args.js";

async function main(): Promise<void> {
  try {
    const options = parseArgs(process.argv.slice(2));
    createProject(options);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\n✗ ${message}\n`);
    process.exit(1);
  }
}

main();
