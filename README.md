babel-plugin-transform-remove-imports
===

[![NPM version](https://img.shields.io/npm/v/babel-plugin-transform-remove-imports.svg?style=flat)](https://npmjs.org/package/babel-plugin-transform-remove-imports)
[![Build Status](https://img.shields.io/travis/uiwjs/babel-plugin-transform-remove-imports.svg?style=flat)](https://travis-ci.org/uiwjs/babel-plugin-transform-remove-imports)

Modular import plugin for babel for [kkt-ssr](https://github.com/jaywcjlove/kkt-ssr) server-side rendering.

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
        "test": "(less|css)$"
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

## Optiosn

- `test: string` Matches based on regular expressions.
- `removeAll: boolean` Delete all import packages.

## Programatic Usage

```js
import plugin from 'babel-plugin-transform-remove-imports'
import { transform } from 'babel-core'
 
function replace (code) {
  return transform(code, {
    babelrc: false,
    plugins: [
      [plugin, { test: "(less|css)$" }]
    ],
  }).code;
}
 
replace("import './index.main.less';import { Button } from 'uiw';")
//=> "import { Button } from 'uiw';"
```

## License

MIT © [`Kenny Wong`](https://github.com/jaywcjlove)