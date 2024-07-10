const colorsMap = {
  reset: [0, 0],
  bold: [1, 22, '\x1B[22m\x1B[1m'],
  dim: [2, 22, '\x1B[22m\x1B[2m'],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],
  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],

  blackBright: [90, 39],
  redBright: [91, 39],
  greenBright: [92, 39],
  yellowBright: [93, 39],
  blueBright: [94, 39],
  magentaBright: [95, 39],
  cyanBright: [96, 39],
  whiteBright: [97, 39],

  bgBlackBright: [100, 49],
  bgRedBright: [101, 49],
  bgGreenBright: [102, 49],
  bgYellowBright: [103, 49],
  bgBlueBright: [104, 49],
  bgMagentaBright: [105, 49],
  bgCyanBright: [106, 49],
  bgWhiteBright: [107, 49],
} as const

export interface Formatter {
  (input?: unknown): string
  open: string
  close: string
}

type ColorName = keyof typeof colorsMap
type ColorsMethods = {
  [Key in ColorName]: Formatter
}

export type Colors = ColorsMethods & {
  isColorSupported: boolean
  reset: (input: unknown) => string
}

const colorsEntries = Object.entries(colorsMap)

function string(str: unknown) {
  return String(str)
}
string.open = ''
string.close = ''

const defaultColors = /* #__PURE__ */ colorsEntries.reduce(
  (acc, [key]) => {
    acc[key as ColorName] = string
    return acc
  },
  { isColorSupported: false } as Colors
)

export function getDefaultColors(): Colors {
  return { ...defaultColors }
}

export function isSupported(isTTY = false) {
  const p = typeof process !== 'undefined' ? process : undefined
  const env = p?.env || {}
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

export function createColors(isTTY = false): Colors {
  const enabled = isSupported(isTTY)

  const replaceClose = (
    string: string,
    close: string,
    replace: string,
    index: number,
  ): string => {
    let result = ''
    let cursor = 0
    do {
      result += string.substring(cursor, index) + replace
      cursor = index + close.length
      index = string.indexOf(close, cursor)
    } while (~index)
    return result + string.substring(cursor)
  }

  const formatter = (open: string, close: string, replace = open) => {
    const fn = (input: unknown) => {
      const string = String(input)
      const index = string.indexOf(close, open.length)
      return ~index
        ? open + replaceClose(string, close, replace, index) + close
        : open + string + close
    }
    fn.open = open
    fn.close = close
    return fn
  }

  const colorsObject = {
    isColorSupported: enabled,
  } as Colors

  const wrap = (num: number) => `\x1B[${num}m`

  for (const [name, formatterArgs] of colorsEntries) {
    colorsObject[name as ColorName] = enabled
      ? formatter(
          wrap(formatterArgs[0]),
          wrap(formatterArgs[1]),
          formatterArgs[2]
        )
      : string
  }

  return colorsObject
}
