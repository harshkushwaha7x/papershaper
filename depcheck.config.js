const depcheck = require("depcheck");

module.exports = {
  specials: [],
  detectors: [],
  parsers: {
    "**/*.ts?(x)": depcheck.parser.typescript,
    "**/*.js?(x)": depcheck.parser.jsx,
  },
  ignoreMatches: ["components", "pages"],
};
