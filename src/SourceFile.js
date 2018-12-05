import { SourceMapConsumer } from "source-map";
import { codeFrameColumns } from "@babel/code-frame";

export default class SourceFile {
  static async fromSourceMap(sourceMapInput) {
    const map = await new SourceMapConsumer(sourceMapInput);
    return new MappedSourceFile(map);
  }

  static async fromSource(filename, source) {
    return new RawSourceFile(filename, source);
  }

  constructor() {
    this._lines = {};
  }
  destroy() {}

  codeFrameAt(loc, options) {
    if (loc.start.source === undefined) {
      throw new Error("loc is not unmapped");
    } else if (loc.start.source !== loc.end.source) {
      throw new Error("loc spans multiple sources");
    }
    const source = this.sourceForFile(loc.start.source);
    return codeFrameColumns(source, loc, options);
  }

  rawSourceAt(loc) {
    if (loc.start.source === undefined) {
      throw new Error("loc is not unmapped");
    } else if (loc.start.source !== loc.end.source) {
      throw new Error("loc spans multiple sources");
    }
    const source = this.linesForSource(loc.start.source);
    const extracted = [];
    for (let i = loc.start.line; i <= loc.end.line; i++) {
      const iStart = i === loc.start.line ? loc.start.column : 1;
      const iEnd = i === loc.end.line ? loc.end.column : undefined;
      const line = source[i - 1].substring(iStart - 1, iEnd);
      extracted.push(line);
    }
    return extracted.join("\n");
  }

  linesForSource(source) {
    if (!this._lines[source]) {
      this._lines[source] = this.sourceForFile(source).split("\n");
    }
    return this._lines[source];
  }

  originalRange(loc) {
    throw new Error("originalRange not implemented");
  }

  sourceForFile(source) {
    throw new Error("sourceForFile not implemented");
  }
}

export class MappedSourceFile extends SourceFile {
  constructor(map) {
    super();
    this._map = map;
    this._map.computeColumnSpans();
  }

  destroy() {
    this._map.destroy();
  }

  // Unmaps the given (parsed) location
  originalRange(loc) {
    const start = this._map.originalPositionFor({
      ...loc.start,
      bias: SourceMapConsumer.LEAST_UPPER_BOUND,
    });
    const end = this._map.originalPositionFor({
      ...loc.end,
      bias: SourceMapConsumer.GREATEST_LOWER_BOUND,
    });
    return { start, end };
  }

  sourceForFile(file) {
    return this._map.sourceContentFor(file);
  }
}

export class RawSourceFile extends SourceFile {
  constructor(filename, source) {
    super();
    this._filename = filename;
    this._source = source;
  }

  originalRange(loc) {
    return {
      start: { source: this._filename, ...loc.start },
      end: { source: this._filename, ...loc.end },
    };
  }

  sourceForFile(file) {
    if (file !== this._filename) {
      throw new Error(`${file} is not the correct file`);
    }
    return this._source;
  }
}
