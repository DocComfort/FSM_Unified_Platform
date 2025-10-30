module.exports = {
  extends: ['../../.eslintrc.cjs'],
  parserOptions: {
    project: ['./tsconfig.app.json']
  },
  ignorePatterns: ['dist', 'build', 'node_modules']
};