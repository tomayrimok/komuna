import { Tag } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const availableColors = ['red', 'blue', 'green', 'teal', 'orange', 'purple', 'pink', 'yellow', 'cyan'] as const;
const categoryColorMap: Record<string, (typeof availableColors)[number] | 'gray'> = {
  'ללא קטגוריה': 'gray',
  'no_category': 'gray',
};

export const getCategoryColor = (category: string) => {
  if (!categoryColorMap[category]) {
    const nextColor = availableColors[Object.keys(categoryColorMap).length % availableColors.length];
    categoryColorMap[category] = nextColor;
  }
  return categoryColorMap[category];
};

export const GroceryItemCategory = ({ category }: { category?: string }) => {
  const { t } = useTranslation();
  const displayCategory = category || t('shopping.no_category');

  return (
    <Tag.Root colorPalette={getCategoryColor(displayCategory)} size="sm" variant="subtle" borderRadius="md">
      <Tag.Label>{displayCategory}</Tag.Label>
    </Tag.Root>
  );
};
