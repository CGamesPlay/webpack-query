// Given a string like "2:10-3:4" return a parsed location object.
export const parseRangeString = loc => {
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

// Given a parsed location, convert it to a location that selects the starting
// line
export const locationToLine = loc => ({
  start: { ...loc.start, column: 0 },
  end: { ...loc.start, column: undefined },
});
