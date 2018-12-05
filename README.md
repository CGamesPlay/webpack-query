# webpack-query

A CLI tool that allows you to ask questions about your webpack bundle.

## Installation

1. Install the software:

```bash
yarn add @cgamesplay/webpack-query
```

2. Set up webpack to save the stats to a well-known location using something like [stats-webpack-plugin](https://github.com/FormidableLabs/webpack-stats-plugin). Make sure that source is included in the output stats.

3. Monkey-patch `node_modules/webpack/lib/Stats.js`

```js
if (showSource && module._source) {
    // Old version:
	// obj.source = module._source.source();
    // New version:
    const sourceAndMap = module._source.sourceAndMap();
    obj.source = sourceAndMap.source;
    obj.sourceMap = sourceAndMap.map;
}
```

4. Add an alias to your `package.json` to make your life easier.

```json
"scripts": {
    "wq": "webpack-query --file path/to/stats.json",
}
```

## Usage

Once you have that alias set up, make sure to build your webpack bundle so that the stats file is available. Then you can use the alias you created to run queries.

```bash
webpack
yarn wq dump
```

### Examples

**Where is this module imported from?**

```
$ yarn wq list-references ./example/src/module.js
example/src/index.js:1:import { sayHello } from "./module";
```

## Operations

### dump

Output the raw webpack stats file. Potentially useful for debugging.

### find-module

Given a string, try to resolve it to a specific module and then output the resolved module's identifier.

### list-references

List all places in where the named module is imported.