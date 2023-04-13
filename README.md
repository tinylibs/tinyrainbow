# tinycolors

> a fork of [picocolors](https://www.npmjs.com/package/picocolors), but browser friendly

## Installing

```bash
// with npm
$ npm install -D tinycolors

// with pnpm
$ pnpm install -D tinycolors

// with yarn
$ yarn install -D tinycolors
```

## Usage

```js
import { createColors } from 'tinycolors'
import { isatty } from 'node:tty'
const c = createColors(isatty(2))

console.log(c.red(c.bold('Hello, World!')))
```
