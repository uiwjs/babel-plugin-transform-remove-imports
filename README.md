babel-plugin-transform-remove-imports
===
<!--rehype:style=display: flex; height: 230px; align-items: center; justify-content: center; font-size: 38px;-->

[![NPM version](https://img.shields.io/npm/v/babel-plugin-transform-remove-imports.svg?style=flat)](https://npmjs.org/package/babel-plugin-transform-remove-imports)
[![CI](https://github.com/uiwjs/babel-plugin-transform-remove-imports/actions/workflows/ci.yml/badge.svg)](https://github.com/uiwjs/babel-plugin-transform-remove-imports/actions/workflows/ci.yml)
[![Coverage Status](https://uiwjs.github.io/babel-plugin-transform-remove-imports/badges.svg)](https://uiwjs.github.io/babel-plugin-transform-remove-imports/lcov-report)
[![Downloadss](https://img.shields.io/npm/dm/babel-plugin-transform-remove-imports.svg?style=flat)](https://npmjs.org/package/babel-plugin-transform-remove-imports)
[![Repo Dependents](https://badgen.net/github/dependents-repo/jaywcjlove/babel-plugin-transform-remove-imports)](https://github.com/jaywcjlove/babel-plugin-transform-remove-imports/network/dependents)

Modular import plugin for babel for server-side rendering. Also works for cjs to delete imported CSS to avoid compilation errors..

## Usage

```bash
npm install babel-plugin-transform-remove-imports --save-dev
```

Via `.babelrc` or `babel-loader`.

```json
{
  "plugins": [
    [
      "babel-plugin-transform-remove-imports", {
        "test": "\\.(less|css)$"
      }
    ]
  ]
}
```

```js
// Input Code
import './index.less';
import './index.main.less';
import { Button } from 'uiw';
import { Select } from '@uiw/core';

// Output   ↓ ↓ ↓ ↓ ↓ ↓
import { Button } from 'uiw';
import { Select } from '@uiw/core';
```

Output Result

```diff
- import './index.less';
- import './index.main.less';
import { Button } from 'uiw';
import { Select } from '@uiw/core';
```

#### Support `require`

Via `.babelrc` or `babel-loader`.

```json
{
  "plugins": [
    [
      "babel-plugin-transform-remove-imports", {
        "test": "@babel/core",
      }
    ]
  ]
}
```

```js
// Input Code
require('@babel/core');
const jest = require('jest');

// Output   ↓ ↓ ↓ ↓ ↓ ↓
var jest = require('jest');
```

Output Result

```diff
- require('@babel/core');
- const jest = require('jest');
+ var jest = require('jest');
```

## Options

- `test: RegExp | string | (RegExp | string)[]`
  
A regular expression to match the imports that will be removed.
It could be a string or a RegExp object.
You could also pass an array here.

- `removeAll: boolean`

Deletes all imports.

- `remove?: 'effects'`

Removing only side effects imports，Used with the `test` option. [#3](https://github.com/uiwjs/babel-plugin-transform-remove-imports/issues/3)

```js
// Input Code
import 'foo';
import Foo from 'foo';

// Output Code  ↓ ↓ ↓ ↓ ↓ ↓
import Foo from 'foo';
```

## Programmatic Usage

```js
import plugin from 'babel-plugin-transform-remove-imports'
import { transform } from 'babel-core'
 
function replace (code) {
  return transform(code, {
    babelrc: false,
    plugins: [
      [plugin, { test: /\.(less|css)$/ }]
    ],
  }).code;
}
 
replace("import './index.main.less';import { Button } from 'uiw';")
//=> "import { Button } from 'uiw';"
```

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/uiwjs/babel-plugin-transform-remove-imports/graphs/contributors">
  <img src="https://uiwjs.github.io/babel-plugin-transform-remove-imports/CONTRIBUTORS.svg" />
</a>

Made with [github-action-contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

[MIT](./LICENSE) © [`Kenny Wong`](https://github.com/jaywcjlove) & [`Slava Fomin II`](https://github.com/slavafomin)
