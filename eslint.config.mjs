// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
    stylistic: true,
  },
  dirs: {
    src: [
      './playground',
    ],
  },
})
  .append(
    {
      rules: {
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/prefer-ts-expect-error': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'vue/max-attributes-per-line': ['error', {
          singleline: {
            max: 4,
          },
          multiline: {
            max: 1,
          },
        }],

        // Project specific overrides
        '@typescript-eslint/no-explicit-any': 'off',
        'vue/multi-word-component-names': 'off',
      },
    },
  )
