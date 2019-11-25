import { transformSync } from "@babel/core";
import { join } from 'path';
import { readFileSync, readdirSync } from 'fs';
import plugin from '../src/index';

const pluginBaseOpts = {
  "presets": [],
};

const fixtureDir = join(__dirname, 'fixtures');
const fixtures = readdirSync(fixtureDir);

fixtures.map((caseName) => {
  const inputFile = join(fixtureDir, caseName, 'input.js');
  const outputFile = join(fixtureDir, caseName, 'output.js');
  test(`should work with ${caseName.split('-').join(' ')}`, () => {
    const type = caseName.split('-')[0];
    if (type === 'cjs') {
      pluginBaseOpts.presets = ["@babel/preset-env"];
      pluginBaseOpts.plugins = [
        [plugin, { test: "(less|css)$" }]
      ]
    } else if (caseName === 'remove-all') {
      pluginBaseOpts.presets = [["@babel/preset-env", { "modules": false }]];
      pluginBaseOpts.plugins = [
        [plugin, { removeAll: true }]
      ]
    } else if (caseName === 'test-regexp-object') {
      pluginBaseOpts.presets = [["@babel/preset-env", { "modules": false }]];
      pluginBaseOpts.plugins = [
        [plugin, { test: /^baz($|\/)/ }]
      ]
    } else if (caseName === 'test-array') {
      pluginBaseOpts.presets = [["@babel/preset-env", { "modules": false }]];
      pluginBaseOpts.plugins = [
        [plugin, { test: [/^foo$/, /^bar$/, /^baz\//] }]
      ]
    } else {
      pluginBaseOpts.presets = [["@babel/preset-env", { "modules": false }]];
    }
    const code = transformSync(readFileSync(inputFile), pluginBaseOpts).code;
    const expected = readFileSync(outputFile).toString();
    expect(code).toBe(expected);
  });
});
