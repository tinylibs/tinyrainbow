import { isatty } from 'node:tty'
import { createColors } from './index'

export * from './index'

export default createColors(isatty(1))
