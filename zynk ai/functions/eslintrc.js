module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'google',
  ],
  rules: {
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'object-curly-spacing': ['error', 'always'],
    'max-len': ['error', { 'code': 120 }],
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off',
    'linebreak-style': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'no-unused-vars': 'warn',
    'arrow-parens': ['error', 'always'],
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
};
