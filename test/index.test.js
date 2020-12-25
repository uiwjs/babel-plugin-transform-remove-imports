
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

const casesPath = join(__dirname, 'cases');

const dirEntries = readdirSync(casesPath, {
  withFileTypes: true,
});

for (const dirEntry of dirEntries) {

  if (!dirEntry.isDirectory()) {
    continue;
  }

  const caseName = dirEntry.name;

  const optionsFilePath = join(casesPath, caseName, 'options.js');
  const inputFilePath = join(casesPath, caseName, 'input.js');
  const expectedOutputFilePath = join(casesPath, caseName, 'output.js');
  const resultFilePath = join(casesPath, caseName, 'result.js');

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

    const source = readFileSync(inputFilePath, {
      encoding: 'utf-8',
    });

    const { code } = transformSync(source, babelOptions);

    writeFileSync(resultFilePath, code);

    const expectedCode = readFileSync(expectedOutputFilePath, {
      encoding: 'utf-8',
    });

    expect(code).toBe(expectedCode);

  });

}
