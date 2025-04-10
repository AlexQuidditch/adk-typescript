import antfu from '@antfu/eslint-config'

import perfectionist from 'eslint-plugin-perfectionist'

export default antfu({
  plugins: [
    perfectionist.configs['recommended-natural'],
  ],
  typescript: {
    overrides: {
      'ts/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      'import/order': 'off',
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            'builtin',
            'external-type',
            ['external'],
            'type',
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
          newlinesBetween: 'always',
          internalPattern: [
            '^@app/.+',
            '^@base/.+',
            '^@shared/.+',
            '^@scopes/.+',
            '^src/.+',
          ],
          environment: 'node',
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-member-accessibility': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  rules: {},
  ignores: [
    '**/*.generated.*',
    '**/_generated/**',
    '_generated/**',
    '/_generated/**',
    'src/**/*.json',
    '**/node_modules/**',
    '**/*.js',
    '**/*.md',
  ],
})
