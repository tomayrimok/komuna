// theme.ts
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    recipes: {
      button: {
        base: {
          borderRadius: 'xl',
        },
      },
    },
    tokens: {
      colors: {
        brand: {
          '50': { value: 'hsl(45, 100%, 97%)' },
          '100': { value: 'hsl(45, 100%, 90%)' },
          '200': { value: 'hsl(45, 100%, 80%)' },
          '300': { value: 'hsl(45, 100%, 70%)' },
          '400': { value: 'hsl(45, 100%, 60%)' },
          '500': { value: 'hsl(45, 100%, 55%)' }, // #FFD04D
          '600': { value: 'hsl(45, 100%, 50%)' },
          '700': { value: 'hsl(45, 90%, 40%)' },
          '800': { value: 'hsl(45, 80%, 30%)' },
          '900': { value: 'hsl(45, 75%, 20%)' },
          '950': { value: 'hsl(45, 70%, 10%)' },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: '{colors.brand.500}' },
          contrast: { value: '{colors.brand.900}' },
          fg: { value: '{colors.brand.700}' },
          muted: { value: '{colors.brand.100}' },
          subtle: { value: '{colors.brand.200}' },
          emphasized: { value: '{colors.brand.300}' },
          focusRing: { value: '{colors.brand.500}' },
        },
      },
    },
  },
  globalCss: {
    html: {
      colorPalette: 'brand',
      bg: 'brand.50',
    },
  },
});

export const theme = createSystem(defaultConfig, config);
export default theme;
