# tinyrainbow

> a fork of [picocolors](https://www.npmjs.com/package/picocolors), but browser friendly

## Installing

```bash
// with npm
$ npm install -D tinyrainbow

// with pnpm
$ pnpm install -D tinyrainbow

// with yarn
$ yarn install -D tinyrainbow
```

## Usage

```js
import { createColors } from 'tinyrainbow'
import { isatty } from 'node:tty'
const c = createColors(isatty(2))

console.log(c.red(c.bold('Hello, World!')))
```
