#!/usr/bin/env node

import program from "commander";
import fs from "fs";

import Stats from "./Stats";
import packageJson from "../package.json";
import { locationToLine } from "./utils";

let stats;

const requireStats = () => {
  if (!stats) {
    console.error("No webpack stats file given. Use --file.");
    process.exit(1);
  }
};

const formatFilename = f => {
  const cwd = process.cwd();
  if (f.slice(0, cwd.length) === cwd) {
    return f.slice(cwd.length + 1);
  } else {
    return f;
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

program.command("list-references <module>").action(async name => {
  const module = stats.resolveModule(name);
  const reasons = module.reasons;
  const results = await Promise.all(
    reasons.map(async r => {
      const sourceFile = await r.module.sourceFile;
      const loc = locationToLine(sourceFile.originalRange(r.loc));
      return { loc, sourceFile };
    }),
  );
  results.forEach(r => {
    console.log(
      "%s:%s:%s",
      formatFilename(r.loc.start.source),
      r.loc.start.line,
      r.sourceFile.rawSourceAt(r.loc),
    );
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
