import c from '../../dist/index.js'

console.log(c.green('Green'))
console.log(c.red('Red'))
console.log({ FORCE_TTY: process.env.FORCE_TTY })
