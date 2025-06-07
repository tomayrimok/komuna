import { Tag } from '@chakra-ui/react';

const availableColors = ['red', 'blue', 'green', 'teal', 'orange', 'purple', 'pink', 'yellow', 'cyan'] as const;
const categoryColorMap: Record<string, (typeof availableColors)[number] | 'gray'> = {
  'ללא קטגוריה': 'gray',
};

export const getCategoryColor = (category: string) => {
  if (!categoryColorMap[category]) {
    const nextColor = availableColors[Object.keys(categoryColorMap).length % availableColors.length];
    categoryColorMap[category] = nextColor;
  }
  return categoryColorMap[category];
};

export const GroceryItemCategory = ({ category = 'ללא קטגוריה' }: { category?: string }) => {
  return (
    <Tag.Root colorPalette={getCategoryColor(category)} size="sm" variant="subtle" borderRadius="md">
      <Tag.Label>{category}</Tag.Label>
    </Tag.Root>
  );
};
