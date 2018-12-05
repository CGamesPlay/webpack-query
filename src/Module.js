import fs from "fs";

import SourceFile from "./SourceFile";
import { parseRangeString } from "./utils";

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
      this._loc = parseRangeString(this.json.loc);
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
      if (this.json.sourceMap) {
        this._sourceFile = SourceFile.fromSourceMap(this.json.sourceMap);
      } else if (this.json.source) {
        this._sourceFile = SourceFile.fromSource(
          this.identifier,
          this.json.source,
        );
      } else {
        throw new Error("Module source/sourceMap not available");
      }
    }
    return this._sourceFile.then(x => x);
  }
}
