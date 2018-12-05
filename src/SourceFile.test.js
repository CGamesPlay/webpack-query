import { SourceMapConsumer } from "source-map";

import SourceFile from "./SourceFile";
import { parseRangeString } from "./utils";

const fakeMap = {
  version: 3,
  file: "min.js",
  names: ["bar", "baz", "n"],
  sources: ["one.js", "two.js"],
  sourcesContent: [
    " ONE.foo = function (bar) {\n   return baz(bar);\n" + " };",
    " TWO.inc = function (n) {\n   return n + 1;\n" + " };",
  ],
  sourceRoot: "/the/root",
  mappings:
    "CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA",
};

const fakeSource = `line 1
line 2
line 3
`;

describe("SourceFile", () => {
  it(".codeFrameAt returns a string", async () => {
    const source = await SourceFile.fromSource("fakeSource", fakeSource);
    try {
      const loc = source.originalRange(parseRangeString("2:6-6"));
      const frame = source.codeFrameAt(loc, { linesAbove: 0, linesBelow: 0 });
      expect(frame).toEqual("> 2 | line 2\n    |      ^");
    } finally {
      source.destroy();
    }
  });

  it(".rawSourceAt returns a string", async () => {
    const source = await SourceFile.fromSource("fakeSource", fakeSource);
    try {
      const loc = source.originalRange(parseRangeString("2:6-6"));
      const frame = source.rawSourceAt(loc);
      expect(frame).toEqual("2");
    } finally {
      source.destroy();
    }
  });
});

describe("MappedSourceFile", () => {
  it(".originalRange returns the range", async () => {
    const source = await SourceFile.fromSourceMap(fakeMap);
    try {
      expect(source.originalRange(parseRangeString("1:5-6"))).toMatchObject({
        start: { line: 1, column: 5, source: "/the/root/one.js" },
        end: { line: 1, column: 5, source: "/the/root/one.js" },
      });
    } finally {
      source.destroy();
    }
  });

  it(".sourceForFile returns the source", async () => {
    const source = await SourceFile.fromSourceMap(fakeMap);
    try {
      expect(source.sourceForFile("/the/root/one.js")).toEqual(
        fakeMap.sourcesContent[0],
      );
    } finally {
      source.destroy();
    }
  });
});

describe("RawSourceFile", () => {
  it(".originalRange returns the range", async () => {
    const source = await SourceFile.fromSource("fakeSource", fakeSource);
    try {
      expect(source.originalRange(parseRangeString("1:2-4"))).toMatchObject({
        start: { line: 1, column: 2, source: "fakeSource" },
        end: { line: 1, column: 4, source: "fakeSource" },
      });
    } finally {
      source.destroy();
    }
  });

  it(".sourceForFile returns the source", async () => {
    const source = await SourceFile.fromSource("fakeSource", fakeSource);
    try {
      expect(source.sourceForFile("fakeSource")).toEqual(fakeSource);
    } finally {
      source.destroy();
    }
  });
});
