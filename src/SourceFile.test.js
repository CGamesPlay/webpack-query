import { default as SourceFile, parseLocation } from "./SourceFile";

const fakeSource = `line 1
line 2
line 3
`;

describe("parseLocation", () => {
  it("handles single line ranges", () => {
    const loc = parseLocation("1:0-36");
    expect(loc).toEqual({
      start: { line: 1, column: 0 },
      end: { line: 1, column: 36 },
    });
  });

  it("handles multi line ranges", () => {
    const loc = parseLocation("18:2-22:4");
    expect(loc).toEqual({
      start: { line: 18, column: 2 },
      end: { line: 22, column: 4 },
    });
  });
});

describe("SourceFile", () => {
  it(".codeFrameAt returns a string", () => {
    const source = new SourceFile("fakeSource", fakeSource);
    const frame = source.codeFrameAt(parseLocation("2:6-6"));
    expect(frame).toEqual("> 2 | line 2\n    |      ^");
  });

  it(".lineAt returns a string", () => {
    const source = new SourceFile("fakeSource", fakeSource);
    const line = source.lineAt(2);
    expect(line).toEqual("line 2");
  });
});
