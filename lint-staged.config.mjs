module.exports = {
  '*.{ts,tsx}': ['prettier --write', 'eslint --cache --fix'],
  '*.{js,jsx}': ['prettier --write', 'eslint --cache --fix'],
  '*.{json,md,sql}': ['prettier --write']
};