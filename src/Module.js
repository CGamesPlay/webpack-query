import fs from "fs";
import { default as SourceFile, parseLocation } from "./SourceFile";

export class Reason {
  constructor(stats, json) {
    this.stats = stats;
    this.json = json;
  }

  get module() {
    return this.stats.getModuleById(this.json.moduleId);
  }

  get loc() {
    if (!this._loc) {
      this._loc = parseLocation(this.json.loc);
    }
    return this._loc;
  }
}

export default class Module {
  static Reason = Reason;

  constructor(stats, json) {
    this.stats = stats;
    this.json = json;
  }

  get identifier() {
    return this.json.identifier;
  }

  get name() {
    return this.json.name;
  }

  get reasons() {
    if (!this._reasons) {
      this._reasons = this.json.reasons.map(r => new Reason(this.stats, r));
    }
    return this._reasons;
  }

  get sourceFile() {
    if (!this._sourceFile) {
      let source = this.json.source;
      if (!source) {
        throw new Error("Module source not available");
      }
      this._sourceFile = new SourceFile(this.identifier, source);
    }
    return this._sourceFile;
  }
}
