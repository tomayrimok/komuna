import { useState } from 'react';
import { Button, Drawer, Flex, IconButton, Input, Portal } from '@chakra-ui/react';
import { IconPlus } from '@tabler/icons-react';
import { ShoppingListItemQuantity } from './shoppingListItemQuantity';
import { ShoppingListItemIsUrgent } from './shoppingListItemIsUrgent';
import { useTranslation } from 'react-i18next';
import { ApiTypes } from '@komuna/types';
import { useShoppingList } from '../../context/auth/ShoppingListProvider';

interface ShoppingListItemDetailsDrawerProps {
  initialText?: string;
  onClose?: () => void;
}

const ShoppingListItemDetailsDrawer = ({ initialText = '', onClose }: ShoppingListItemDetailsDrawerProps) => {
  const { handleAddItem } = useShoppingList();
  const [newItem, setNewItem] = useState<Partial<ApiTypes.ShoppingListItemWithIdDto> | null>({
    name: initialText,
    amount: 1,
  });

  const { t } = useTranslation();

  const onHandleAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      if (!newItem) return;
      await handleAddItem(newItem as ApiTypes.ShoppingListItemWithIdDto);
      setNewItem(null);
      onClose?.();
    } catch (error) {
      console.error('trili', error);
    }
  };
  return (
    <Drawer.Root placement={'bottom'} onExitComplete={onClose && onClose}>
      <Drawer.Trigger asChild>
        <IconButton aria-label="Add Item" onClick={() => initialText && setNewItem({ name: initialText, amount: 1 })}>
          <IconPlus />
        </IconButton>
      </Drawer.Trigger>

      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content h={'2xs'} borderTopRadius={'2xl'} onClick={(e) => e.stopPropagation()}>
            <Drawer.Header>
              <Drawer.Title>{t('shopping.add_item')}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Input
                placeholder={t('shopping.item_name')}
                value={newItem?.name || ''}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                mb={3}
                autoFocus
              />

              <Flex justify="space-between" align="center">
                <Flex align="center" gap={2}>
                  <ShoppingListItemQuantity
                    handleChange={(amount) => {
                      setNewItem({ ...newItem, amount });
                    }}
                    amount={newItem?.amount}
                  />
                </Flex>

                <Flex gap={2}>
                  <ShoppingListItemIsUrgent
                    handleChange={(isUrgent) => {
                      setNewItem({ ...newItem, isUrgent });
                    }}
                    isUrgent={newItem?.isUrgent}
                  />
                </Flex>
              </Flex>
            </Drawer.Body>
            <Drawer.Footer justifyContent="space-between">
              <Drawer.ActionTrigger asChild>
                <Button variant="outline">{t('cancel')}</Button>
              </Drawer.ActionTrigger>
              <Drawer.ActionTrigger asChild>
                <Button onClick={onHandleAdd} disabled={!newItem?.name?.trim()}>
                  {t('save')}
                </Button>
              </Drawer.ActionTrigger>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default ShoppingListItemDetailsDrawer;
