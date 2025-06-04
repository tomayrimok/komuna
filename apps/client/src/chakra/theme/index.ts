import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    recipes: {
      button: {
        base: {
          borderRadius: 'lg',
          paddingY: '12px',
          paddingX: '30px',
        },
        variants: {
          variant: {
            ghost: {
              color: 'brand.900',
            },
          },
        },
      },
      input: {
        base: {
          borderRadius: 'xl',
          background: 'white',
        },

      },
    },
    tokens: {
      fonts: {
        body: {
          value: `"Assistant", sans-serif`,
        },
      },
      colors: {
        brand: {
          '10': { value: '#FFFCF4' }, // #FFFCF4
          '50': { value: 'hsl(45, 100%, 95%)' },
          '100': { value: 'hsl(45, 100%, 90%)' },
          '200': { value: 'hsl(45, 100%, 85%)' },
          '300': { value: 'hsl(45, 100%, 80%)' },
          '400': { value: 'hsl(45, 100%, 75%)' },
          '500': { value: '#F9C154' }, // #F9C154 (main)
          '600': { value: 'hsl(45, 95%, 60%)' },
          '700': { value: 'hsl(45, 90%, 45%)' },
          '800': { value: 'hsl(40, 85%, 30%)' },
          '900': { value: 'hsl(38, 80%, 20%)' },
          '950': { value: 'hsl(35, 71%, 12%)' }, // #351F07
        },
      },
    },
    semanticTokens: {
      fonts: {
        logo: { value: `"Luckiest Guy", cursive` },
      },
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
      backgroundColor: 'brand.10',
    },
    body: {
      color: 'brand.950',
    },
  },
});

export const theme = createSystem(defaultConfig, config);
export default theme;
