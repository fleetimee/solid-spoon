import { FlatCompat } from '@eslint/eslintrc'
 
const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})
 
const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
    rules: {
      'react/react-in-jsx-scope': 'off', // Next.js does not require React to be in scope
      'no-unused-vars': 'off', // Disable base unused variables rule (recommended for @typescript-eslint/no-unused-vars)
      '@typescript-eslint/no-unused-vars': 'off', // Disable TypeScript-specific unused variables rule
      'no-console': 'off', // Disable console statements
      'import/no-anonymous-default-export': 'off', // Allow anonymous default exports
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn', // Ensure no-explicit-any is active
    },
  }),
]
 
export default eslintConfig