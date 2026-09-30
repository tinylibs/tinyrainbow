export interface Formatter {
  (input?: unknown): string
  open: string
  close: string
}

export type Colors = ReturnType<typeof createColorsMap>

function noop(str: unknown) {
  return String(str)
}
noop.open = ''
noop.close = ''

const noopFormatter = () => noop;

const replaceClose = (
  string: string,
  close: string,
  replace: string,
  index: number,
  closeLength: number
): string => {
  let result = ''
  let cursor = 0
  do {
    result += string.substring(cursor, index) + replace
    cursor = index + closeLength
    index = string.indexOf(close, cursor)
  } while (~index)
  return result + string.substring(cursor)
}

const formatter = (open: string, close: string, replace = open) => {
  const openLength = open.length
  const closeLength = close.length
  const fn = (input: unknown) => {
    const string = input + ''
    const index = string.indexOf(close, openLength)
    return ~index
      ? open + replaceClose(string, close, replace, index, closeLength) + close
      : open + string + close
  }
  fn.open = open
  fn.close = close
  return fn
}

function createColorsMap(enabled: boolean) {
  const f = enabled ? formatter : noopFormatter
  const colorsMap = {
    isColorSupported: enabled,
    reset: f('\x1B[0m', '\x1B[0m'),
    bold: f('\x1B[1m', '\x1B[22m', '\x1B[22m\x1B[1m'),
    dim: f('\x1B[2m', '\x1B[22m', '\x1B[22m\x1B[2m'),
    italic: f('\x1B[3m', '\x1B[23m'),
    underline: f('\x1B[4m', '\x1B[24m'),
    inverse: f('\x1B[7m', '\x1B[27m'),
    hidden: f('\x1B[8m', '\x1B[28m'),
    strikethrough: f('\x1B[9m', '\x1B[29m'),
    black: f('\x1B[30m', '\x1B[39m'),
    red: f('\x1B[31m', '\x1B[39m'),
    green: f('\x1B[32m', '\x1B[39m'),
    yellow: f('\x1B[33m', '\x1B[39m'),
    blue: f('\x1B[34m', '\x1B[39m'),
    magenta: f('\x1B[35m', '\x1B[39m'),
    cyan: f('\x1B[36m', '\x1B[39m'),
    white: f('\x1B[37m', '\x1B[39m'),
    gray: f('\x1B[90m', '\x1B[39m'),
    bgBlack: f('\x1B[40m', '\x1B[49m'),
    bgRed: f('\x1B[41m', '\x1B[49m'),
    bgGreen: f('\x1B[42m', '\x1B[49m'),
    bgYellow: f('\x1B[43m', '\x1B[49m'),
    bgBlue: f('\x1B[44m', '\x1B[49m'),
    bgMagenta: f('\x1B[45m', '\x1B[49m'),
    bgCyan: f('\x1B[46m', '\x1B[49m'),
    bgWhite: f('\x1B[47m', '\x1B[49m'),

    blackBright: f('\x1B[90m', '\x1B[39m'),
    redBright: f('\x1B[91m', '\x1B[39m'),
    greenBright: f('\x1B[92m', '\x1B[39m'),
    yellowBright: f('\x1B[93m', '\x1B[39m'),
    blueBright: f('\x1B[94m', '\x1B[39m'),
    magentaBright: f('\x1B[95m', '\x1B[39m'),
    cyanBright: f('\x1B[96m', '\x1B[39m'),
    whiteBright: f('\x1B[97m', '\x1B[39m'),

    bgBlackBright: f('\x1B[100m', '\x1B[49m'),
    bgRedBright: f('\x1B[101m', '\x1B[49m'),
    bgGreenBright: f('\x1B[102m', '\x1B[49m'),
    bgYellowBright: f('\x1B[103m', '\x1B[49m'),
    bgBlueBright: f('\x1B[104m', '\x1B[49m'),
    bgMagentaBright: f('\x1B[105m', '\x1B[49m'),
    bgCyanBright: f('\x1B[106m', '\x1B[49m'),
    bgWhiteBright: f('\x1B[107m', '\x1B[49m'),
  } as const
  return colorsMap
}

export function getDefaultColors(): Colors {
  return createColorsMap(false)
}

export function isSupported() {
  const p = typeof process !== 'undefined' ? process : undefined
  const env = p?.env || {}
  const isTTY = env.FORCE_TTY !== 'false' // assume TTY
  const argv = p?.argv || []
  const nodeEnabled =
    !('NO_COLOR' in env || argv.includes('--no-color')) &&
    ('FORCE_COLOR' in env ||
      argv.includes('--color') ||
      p?.platform === 'win32' ||
      (isTTY && env.TERM !== 'dumb') ||
      'CI' in env)
  // chromium browsers support ANSI colors in console
  // @ts-expect-error chrome is not a standard feature
  return nodeEnabled || (typeof window !== 'undefined' && !!window.chrome)
}

export function createColors({ force }: { force?: boolean } = {}): Colors {
  const enabled = force || isSupported()

  const colorsObject = createColorsMap(enabled)

  return colorsObject
}

const colors = createColors()

export function disableDefaultColors() {
  Object.assign(colors, getDefaultColors())
}

export function enabledDefaultColors() {
  Object.assign(colors, createColors({ force: true }))
}

export default colors
