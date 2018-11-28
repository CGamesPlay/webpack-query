import path from "path";

import json from "../example/dist/stats.json";
import Stats from "./Stats";
import Module from "./Module";

describe("Stats", () => {
  describe("getModuleById", () => {
    it("returns modules", () => {
      const stats = Stats.fromJson(json);
      expect(stats.getModuleById(0)).toBeInstanceOf(Module);
    });

    it("throws errors", () => {
      const stats = Stats.fromJson(json);
      expect(() => stats.getModuleById(null)).toThrow("Invalid module ID");
    });
  });

  describe("resolveModule", () => {
    it("resolves by module name", () => {
      const stats = Stats.fromJson(json);
      const module = stats.resolveModule("./src/module.js");
      expect(module).toHaveProperty("json.id", 1);
    });

    it("resolves by full path", () => {
      const stats = Stats.fromJson(json);
      const resolved = path.resolve(__dirname, "../example/src/module.js");
      const module = stats.resolveModule(resolved);
      expect(module).toHaveProperty("json.id", 1);
    });
  });
});
