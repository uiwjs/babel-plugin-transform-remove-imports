import { transformSync } from '@babel/core';
import * as removalHooks from '@babel/traverse/lib/path/lib/removal-hooks.js';

import plugin from '../src/index';

const babelOptions = {
  babelrc: false,
  configFile: false,
  sourceType: 'module',
  plugins: [
    [plugin, { test: '\\.css$' }],
  ],
};

function transform(source) {
  return transformSync(source, babelOptions).code;
}

// Babel's own removal hook deletes a variable declaration that loses its last
// declarator, and an `export` wrapped around it. These tests turn that hook
// off so the plugin's fallback runs.
function withoutRemovalHooks(run) {
  const saved = removalHooks.hooks.splice(0, removalHooks.hooks.length);

  try {
    return run();
  } finally {
    removalHooks.hooks.push(...saved);
  }
}

test('removes an empty declaration when Babel leaves it in place', () => {
  const code = withoutRemovalHooks(() => transform([
    'function demo() {',
    '  const styles = require("./button.css");',
    '  return 1;',
    '}',
    'const removed = require("./multi.css"), kept = 1;',
    'const bothA = require("./both-a.css"), bothB = require("./both-b.css");',
    'let stylesLet = require("./let.css");',
    'var { join } = require("./var-pattern.css"), keptPattern = 3;',
  ].join('\n')));

  expect(code).toBe([
    'function demo() {',
    '  return 1;',
    '}',
    'const kept = 1;',
    'let stylesLet;',
    'var keptPattern = 3;',
  ].join('\n'));
});

test('removes an empty export when Babel leaves the declaration in place', () => {
  const code = withoutRemovalHooks(() => transform([
    'export const exported = require("./export.css");',
    'export const exportedRemoved = require("./export-multi.css"), exportedKept = 4;',
    'const kept = require("path");',
  ].join('\n')));

  expect(code).toBe([
    'export const exportedKept = 4;',
    'const kept = require("path");',
  ].join('\n'));
});

test('drops only the initializer when the declarator parent is not a variable declaration', () => {
  let proto;

  transformSync('var x = 1;', {
    babelrc: false,
    configFile: false,
    ast: false,
    plugins: [
      function capturePath() {
        return {
          visitor: {
            VariableDeclaration(path) {
              proto = Object.getPrototypeOf(path);
            },
          },
        };
      },
    ],
  });

  const original = proto.isVariableDeclaration;

  proto.isVariableDeclaration = function isVariableDeclaration() {
    if (new Error().stack.includes('removeRequireBinding')) {
      return false;
    }

    return original.call(this);
  };

  try {
    // `kind` stays unknown, so a plain identifier keeps its binding and a
    // destructuring pattern is still removed.
    const code = transform([
      'const styles = require("./button.css");',
      'const { join } = require("./join.css");',
      'let kept = require("path");',
    ].join('\n'));

    expect(code).toBe([
      'const styles;',
      'let kept = require("path");',
    ].join('\n'));
  } finally {
    proto.isVariableDeclaration = original;
  }
});
