import semver from "semver";
import fs from "fs";
import path from "path";
import { find } from "lodash";

import Module from "./Module";

export default class Stats {
  static fromJson(json) {
    const version = semver.valid(json.version);
    if (!version) {
      throw new Error("Invalid webpack stats file (no version)");
    } else if (!semver.satisfies(json.version, "3.5")) {
      throw new Error(
        "Invalid webpack stats file (version " + version + " not supported)",
      );
    } else if (!json.modules) {
      throw new Error("Invalid webpack stats file (missing modules stats)");
    } else {
      return new Stats(json);
    }
  }

  constructor(json) {
    this.json = json;
    this.modules = {};
  }

  getModuleById(id) {
    if (this.modules[id]) {
      return this.modules[id];
    }
    const module = find(this.json.modules, m => m.id === id);
    if (!module) {
      throw new Error("Invalid module ID " + id);
    }
    this.modules[id] = new Module(this, module);
    return this.modules[id];
  }

  // Return the module based on the module name. Module name can be a path to a
  // local file, or a literal name in the bundle.
  resolveModule(name) {
    const nameMatch = find(this.json.modules, m => m.name === name);
    if (nameMatch) return this.getModuleById(nameMatch.id);
    if (fs.existsSync(name)) {
      name = path.resolve(name);
      const identifierMatch = find(
        this.json.modules,
        m => m.identifier === name,
      );
      if (identifierMatch) return this.getModuleById(identifierMatch.id);
    }
    return null;
  }
}
