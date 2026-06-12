import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    ignores: ['.next/', 'node_modules/', 'out/'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // Keep defaults from @eslint/js:recommended.
    },
  },
  {
    // For the lint command in this repo, avoid linting generated/built artifacts.
    // This project uses Next.js which generates code under `.next/`.
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    ignores: ['**/.next/**'],
  },
];


