babel-plugin-transform-remove-imports
===

[![NPM version](https://img.shields.io/npm/v/babel-plugin-transform-remove-imports.svg?style=flat)](https://npmjs.org/package/babel-plugin-transform-remove-imports)
[![Build Status](https://img.shields.io/travis/jaywcjlove/babel-plugin-transform-remove-imports.svg?style=flat)](https://travis-ci.org/jaywcjlove/babel-plugin-transform-remove-imports)

Modular import plugin for babel for kkt-ssr server-side rendering.

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
        "test": "/(less|css)$/"
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