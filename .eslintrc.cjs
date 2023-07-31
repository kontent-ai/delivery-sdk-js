/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json']
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-namespace': 'off'
    },
    root: true
};
