export class Reason {
  constructor(stats, json) {
    this.stats = stats;
    this.json = json;
  }

  get module() {
    return this.stats.getModuleById(this.json.moduleId);
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

  get reasons() {
    if (!this._reasons) {
      this._reasons = this.json.reasons.map(r => new Reason(this.stats, r));
    }
    return this._reasons;
  }
}
