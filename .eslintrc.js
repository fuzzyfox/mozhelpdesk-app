// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: [
    'standard',
    'prettier'
  ],
  // required to lint *.vue files
  plugins: [
    'html',
    'prettier'
  ],
  'settings': {
    'html/html-extensions': ['.html', '.vue'],  // consider .html and .we files as HTML
  },
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // enable prettier formatting rules
    'prettier/prettier': [ 1, { semi: false, singleQuote: true } ]
  }
}
