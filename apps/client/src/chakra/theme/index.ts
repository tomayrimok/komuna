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
          '10': { value: '#FFFCF4' },
          '50': { value: 'hsl(45, 100%, 97%)' },
          '100': { value: 'hsl(45, 100%, 90%)' },
          '200': { value: 'hsl(45, 100%, 85%)' },
          '300': { value: 'hsl(45, 100%, 78%)' },
          '400': { value: 'hsl(45, 100%, 75%)' },
          '500': { value: 'hsl(45, 100%, 73%)' }, // #ffcf79 (main)
          '600': { value: 'hsl(45, 95%, 60%)' },
          '700': { value: 'hsl(45, 90%, 45%)' },
          '800': { value: 'hsl(45, 85%, 30%)' },
          '900': { value: 'hsl(45, 80%, 20%)' },
          '950': { value: 'hsl(45, 83%, 13.5%)' },
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
    },
    body: {
      backgroundColor: 'brand.10',
    },
  },
});

export const theme = createSystem(defaultConfig, config);
export default theme;
