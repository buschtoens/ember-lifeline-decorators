/* eslint-env node */

module.exports = {
  root: true,
  parser: 'typescript-eslint-parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: ['ember', 'typescript', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'typescript',
    'typescript/prettier',
    'plugin:prettier/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
    'require-jsdoc': 'off',
    'typescript/explicit-member-accessibility': 'off'
  },
  overrides: [
    // node files
    {
      files: [
        '.template-lintrc.js',
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js'
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'app/**',
        'tests/dummy/app/**'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      rules: Object.assign(
        {},
        require('eslint-plugin-node').configs.recommended.rules,
        {
          'typescript/no-var-requires': 'off'
        }
      )
    }
  ]
};
