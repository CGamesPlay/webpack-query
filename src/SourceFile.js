import { codeFrameColumns } from "@babel/code-frame";

export const parseLocation = loc => {
  let [start, end] = loc
    .split("-")
    .map(piece => piece.split(":").map(num => parseInt(num, 10)));
  return {
    start: {
      line: start[0],
      column: start[1],
    },
    end: {
      line: end.length === 1 ? start[0] : end[0],
      column: end[end.length - 1],
    },
  };
};

export default class SourceFile {
  constructor(filename, source) {
    this.filename = filename;
    this.source = source;
  }

  // Returns a string showing the code frame at the given (parsed) location
  codeFrameAt(loc, options) {
    return codeFrameColumns(this.source, loc, {
      linesAbove: 0,
      linesBelow: 0,
      ...options,
    });
  }

  // Returns a string of the specific line requested
  lineAt(line) {
    if (!this._lines) {
      this._lines = this.source.split("\n");
    }
    return this._lines[line - 1];
  }
}
