babel-plugin-transform-remove-imports
===

[![NPM version](https://img.shields.io/npm/v/babel-plugin-transform-remove-imports.svg?style=flat)](https://npmjs.org/package/babel-plugin-transform-remove-imports)
[![Build Status](https://img.shields.io/travis/uiwjs/babel-plugin-transform-remove-imports.svg?style=flat)](https://travis-ci.org/uiwjs/babel-plugin-transform-remove-imports)
[![Coverage Status](https://coveralls.io/repos/github/uiwjs/babel-plugin-transform-remove-imports/badge.svg?branch=master)](https://coveralls.io/github/uiwjs/babel-plugin-transform-remove-imports?branch=master)

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

## License

[MIT](./LICENSE) © [`Kenny Wong`](https://github.com/jaywcjlove) & [`Slava Fomin II`](https://github.com/slavafomin)
