// Configuration for remark - markdown processor and linter
// See: https://remark.js.org/

export default {
  plugins: [
    // Lint presets for consistent markdown
    'remark-preset-lint-recommended',
    'remark-preset-lint-consistent',
    
    // Additional linting rules
    ['remark-lint-maximum-line-length', 120],
    ['remark-lint-no-consecutive-blank-lines', true],
    ['remark-lint-no-duplicate-headings-in-section', true],
    ['remark-lint-no-emphasis-as-heading', true],
    ['remark-lint-no-file-name-irregular-characters', '\\.a-zA-Z0-9-_'],
    ['remark-lint-no-file-name-consecutive-dashes', true],
    ['remark-lint-no-file-name-outer-dashes', true],
    
    // Relaxed rules for our documentation style
    ['remark-lint-list-item-indent', 'space'],
    ['remark-lint-maximum-heading-length', 80],
    ['remark-lint-no-shell-dollars', false], // Allow $ in code examples
  ],
  
  settings: {
    // Markdown formatting preferences
    bullet: '-',
    emphasis: '*',
    fences: true,
    listItemIndent: '1',
    rule: '-',
    strong: '*',
    tightDefinitions: true
  }
}