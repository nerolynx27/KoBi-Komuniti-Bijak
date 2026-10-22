import hooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['dist/**', 'output/**', '**/.hyperframes/**', '**/.thumbnails/**', '**/renders/**', '**/snapshots*/**', 'node_modules/**', 'fabric/**', 'tmp/**', 'artifacts/**', 'test-results/**', 'playwright-report/**', 'playwright-production-report/**', 'docs/verification/part-3/automated/**'] },
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } }, globals: Object.fromEntries(['window', 'document', 'ResizeObserver', 'URL', 'Blob', 'DOMException', 'setTimeout', 'clearTimeout', 'console', 'process', 'localStorage', 'requestAnimationFrame', 'fetch'].map(name => [name, 'readonly'])) },
    plugins: { 'react-hooks': hooks },
    rules: { 'no-unreachable': 'error', 'no-duplicate-imports': 'error', 'no-constant-condition': 'error', 'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }], 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'error' },
  },
];
