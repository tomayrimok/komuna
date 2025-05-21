import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'swagger.json',
  output: {
    path: 'libs/types/src/generated',
    case: 'camelCase',
    format: 'prettier',
    lint: 'eslint',
  },
  plugins: ['@hey-api/client-axios', '@tanstack/react-query'],
});
