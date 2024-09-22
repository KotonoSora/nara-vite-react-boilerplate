import { options as tailwindPluginOptions } from 'prettier-plugin-tailwindcss'
import organizeImports from 'prettier-plugin-organize-imports'

/** @type {import('prettier').Config} */
export default {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'consistent',
  jsxSingleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'auto',
  singleAttributePerLine: true,
  plugins: [tailwindPluginOptions, organizeImports],
}
