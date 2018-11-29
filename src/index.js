#!/usr/bin/env node

import program from "commander";
import fs from "fs";

import Stats from "./Stats";
import packageJson from "../package.json";

let stats;

const requireStats = () => {
  if (!stats) {
    console.error("No webpack stats file given. Use --file.");
    process.exit(1);
  }
};

program
  .version(packageJson.version)
  .option("-f, --file <path>", "Path to webpack stats file")
  .on("option:file", () => {
    try {
      stats = Stats.fromJson(
        JSON.parse(fs.readFileSync(program.file, "utf-8")),
      );
    } catch (e) {
      console.error("Failed to read stats file:", e.message);
      process.exit(1);
    }
  });

program
  .command("dump")
  .description("Output raw webpack stats")
  .action(() => {
    requireStats();
    console.log(stats.json);
  });

program
  .command("find-module <module>")
  .description("Resolve a module's name")
  .action(name => {
    requireStats();
    const module = stats.resolveModule(name);
    console.log(module.identifier);
  });

program.command("list-references <module>").action(name => {
  const module = stats.resolveModule(name);
  const reasons = module.reasons;
  reasons.forEach(r => {
    console.log("Referenced by " + r.module.name);
    console.log(r.module.sourceFile.codeFrameAt(r.loc));
  });
});

program.on("command:*", function() {
  console.error(
    "Invalid command: %s\nSee --help for a list of available commands.",
    program.args.join(" "),
  );
  process.exit(1);
});

program.parse(process.argv);
if (program.args.length === 0) {
  program.outputHelp();
}
