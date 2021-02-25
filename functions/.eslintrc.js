module.exports = {
  'root': true,
  'env': {
    es6: true,
    node: true,
    browser: true,
  },
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaVersion': 8,
  },
  'extends': [
    'eslint:recommended',
    'google',
  ],
  'rules': {
    "quotes": 'off',
    'require-jsdoc': 0,
    'max-len': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-unsafe-negation': 'off',
    'new-cap': 'off',
    'indent': 'off',
    'object-curly-spacing': 'off',
    'space-before-function-paren': 'off',
    'linebreak-style': 'off',
    'eol-last': 'off',
    'padded-blocks': 'off'
  },
};
