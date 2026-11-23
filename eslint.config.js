module.exports = [
  { ignores: ['node_modules/**', '.npm-cache/**', 'coverage/**', 'evidence/**'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly', module: 'readonly', process: 'readonly',
        console: 'readonly', fetch: 'readonly',
        beforeAll: 'readonly', afterAll: 'readonly', test: 'readonly', expect: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'error', 'no-undef': 'error',
      'eqeqeq': ['error', 'always'], 'curly': ['error', 'all']
    }
  }
];
