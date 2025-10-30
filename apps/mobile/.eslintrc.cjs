module.exports = {
  extends: ['../../.eslintrc.cjs'],
  parserOptions: {
    project: ['./tsconfig.json']
  },
  plugins: ['react-native'],
  rules: {
    'react-native/no-inline-styles': 'off'
  }
};