import path from "path";

import json from "../example/dist/stats.json";
import Stats from "./Stats";
import Module from "./Module";

const getModule = id => {
  const stats = new Stats(json);
  return stats.getModuleById(id);
};

describe("Reason", () => {
  const getReason = () => getModule(1).reasons[0];

  describe("module", () => {
    it("is a Module", () => {
      const reason = getReason();
      const module = reason.module;
      expect(module).toBeInstanceOf(Module);
      expect(module.json.id).toEqual(0);
    });
  });
});

describe("Module", () => {
  it(".identifier is the module identifier", () => {
    const module = getModule(1);
    const resolved = path.resolve(__dirname, "../example/src/module.js");
    expect(module.identifier).toEqual(resolved);
  });

  it(".name is the module name", () => {
    const module = getModule(1);
    expect(module.name).toEqual("./src/module.js");
  });

  it(".reasons is an array of Reasons", () => {
    const module = getModule(1);
    const reasons = module.reasons;
    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toBeInstanceOf(Module.Reason);
  });

  it(".sourceFile gets source from stats", () => {
    const module = getModule(1);
    expect(typeof module.sourceFile.source).toEqual("string");
  });
});
