export interface CreateOptions {
  dir: string;
  preset: string;
  install: boolean;
}

const DEFAULT_DIR = "my-openblog";
const DEFAULT_PRESET = "vercel-geist";

export function parseArgs(argv: string[]): CreateOptions {
  let dir: string | undefined;
  let preset = DEFAULT_PRESET;
  let install = true;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--dir" && argv[i + 1]) {
      dir = argv[++i];
      continue;
    }

    if (arg.startsWith("--dir=")) {
      dir = arg.slice("--dir=".length);
      continue;
    }

    if (arg === "--preset" && argv[i + 1]) {
      preset = argv[++i];
      continue;
    }

    if (arg.startsWith("--preset=")) {
      preset = arg.slice("--preset=".length);
      continue;
    }

    if (arg === "--no-install") {
      install = false;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unknown flag: ${arg}`);
    }

    if (!dir) {
      dir = arg;
    }
  }

  return {
    dir: dir ?? DEFAULT_DIR,
    preset,
    install,
  };
}

function printHelp(): void {
  console.log(`Usage: create-openblog [project-name] [options]

Options:
  --dir <name>       Project folder name (default: arg or "${DEFAULT_DIR}")
  --preset <preset>  Theme preset (default: ${DEFAULT_PRESET})
  --no-install       Skip npm install
  -h, --help         Show this help
`);
}
