
import { transformSync } from '@babel/core';
import { join } from 'path';
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';

import plugin from '../src/index';


const defaultBabelOptions = {
  presets: [
    ['@babel/preset-env', { modules: false }],
  ],
  plugins: [],
};

const fixtureDir = join(__dirname, 'new-fixtures');

const dirEntries = readdirSync(fixtureDir, {
  withFileTypes: true,
});

for (const dirEntry of dirEntries) {

  if (!dirEntry.isDirectory()) {
    continue;
  }

  const caseName = dirEntry.name;

  const optionsFilePath = join(fixtureDir, caseName, 'options.js');
  const inputFile = join(fixtureDir, caseName, 'input.js');
  const expectedOutputFile = join(fixtureDir, caseName, 'output.js');
  const resultFile = join(fixtureDir, caseName, 'result.js');

  test(`Case '${caseName}' should work correctly`, () => {

    const babelOptions = {
      ...defaultBabelOptions,
    };

    // Loading case-specific options
    if (existsSync(optionsFilePath)) {

      const caseOptionsModule = require(optionsFilePath);
      const caseOptions = (caseOptionsModule.default || caseOptionsModule);

      Object.assign(babelOptions, caseOptions.babelOptions || {});

      babelOptions.plugins = [
        ...babelOptions.plugins,
        [plugin, (caseOptions.pluginOptions || {})]
      ];

    }

    const source = readFileSync(inputFile, {
      encoding: 'utf-8',
    });

    const { code } = transformSync(source, babelOptions);

    writeFileSync(resultFile, code);

    const expectedCode = readFileSync(expectedOutputFile, {
      encoding: 'utf-8',
    });

    expect(code).toBe(expectedCode);

  });

}
