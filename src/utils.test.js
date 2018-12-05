import { parseRangeString, locationToLine } from "./utils";

describe("parseRangeString", () => {
  it("handles single line ranges", () => {
    const loc = parseRangeString("1:0-36");
    expect(loc).toEqual({
      start: { line: 1, column: 0 },
      end: { line: 1, column: 36 },
    });
  });

  it("handles multi line ranges", () => {
    const loc = parseRangeString("18:2-22:4");
    expect(loc).toEqual({
      start: { line: 18, column: 2 },
      end: { line: 22, column: 4 },
    });
  });
});

describe("locationToLine", () => {
  it("takes the start line", () => {
    const loc = {
      start: { line: 1, column: 10 },
      end: { line: 10, column: 4 },
    };
    expect(locationToLine(loc)).toEqual({
      start: { line: 1, column: 0 },
      end: { line: 1, column: undefined },
    });
  });
});
