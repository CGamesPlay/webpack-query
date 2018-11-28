const path = require("path");
const StatsWebpackPlugin = require("stats-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    new StatsWebpackPlugin("stats.json", {
      chunkModules: true,
    }),
  ],
};
