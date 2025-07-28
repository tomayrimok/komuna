import { Badge, Button, Checkbox, CheckboxCheckedChangeDetails, CloseButton, Drawer, Portal, VStack } from '@chakra-ui/react';
import { IconShoppingBag } from '@tabler/icons-react';
import { usePurchase } from '../../context/auth/PurchaseProvider';
import { useShoppingList } from '../../context/auth/ShoppingListProvider';
import { useFilterList } from '../../hooks/useFilterList';
import { testInput } from '../../utils/testInput';
import SearchInput from '../searchInput';
import SelectionCard from '../selectionCard';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import CreatePurchaseButton from './createPurchaseButton';
import { ContextType } from '@komuna/types';
import { useState } from 'react';

interface ShoppingListPurchaseDrawerProps {
  isFixed?: boolean;
  contextType?: ContextType;
}

const ShoppingListPurchaseDrawer: React.FC<ShoppingListPurchaseDrawerProps> = ({ isFixed = true, contextType }) => {
  const { items, purchaseItems } = useShoppingList();
  const { toggleItem } = usePurchase();
  const { t } = useTranslation();
  const [markAllAsPurchased, setMarkAllAsPurchased] = useState(false);

  const { filteredResults, handleChange } = useFilterList(
    items.filter((item) => !item.isPurchased),
    (list, value) => list.filter((item) => testInput(item.name, value))
  );

  const navigate = useNavigate();

  const handleSave = () => {
    navigate({ to: '/roommate/payments/create-expense', search: { fromShoppingList: true } });
  };

  const handleMarkAllAsPurchased = (details: CheckboxCheckedChangeDetails) => {
    setMarkAllAsPurchased(!!details.checked);
    if (details.checked) {
      filteredResults.forEach((item) => {
        if (!purchaseItems?.some((i) => i.itemId === item.itemId)) toggleItem(item);
      });
    } else {
      filteredResults.forEach((item) => {
        if (purchaseItems?.some((i) => i.itemId === item.itemId)) toggleItem(item);
      });
    }
  };

  return (
    <Drawer.Root placement={'bottom'}>
      <CreatePurchaseButton isFixed={isFixed} contextType={contextType} />
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content h={'2xl'}>
            <Drawer.Header>
              <Drawer.Title>{t('shopping.choose_purchased_items')}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <SearchInput placeholder={t('shopping.search_item')} handleChange={handleChange} />
              <VStack alignItems={'flex-start'}>
                <Checkbox.Root mb={1} mt={2} checked={markAllAsPurchased} onCheckedChange={handleMarkAllAsPurchased}>
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>{t('shopping.mark_all_as_purchased')}</Checkbox.Label>
                </Checkbox.Root>
                {filteredResults.map((item) => {
                  const isSelected = purchaseItems?.some((i) => i.itemId === item.itemId);
                  return (
                    <SelectionCard
                      key={item.itemId}
                      title={item.name}
                      description={item.category}
                      image={item.image}
                      selected={isSelected}
                      fallbackIcon={<IconShoppingBag />}
                      onClick={() => toggleItem(item)}
                      additionalComponent={!isSelected && <Badge colorPalette="blue" borderRadius={'xl'} size={'md'} me={1}>{item.amount}</Badge>}
                    />
                  )
                })}
              </VStack>
            </Drawer.Body>
            <Drawer.Footer justifyContent="space-between">
              <Drawer.ActionTrigger asChild>
                <Button variant="outline">{t('cancel')}</Button>
              </Drawer.ActionTrigger>
              <Button onClick={handleSave}>{t('continue')}</Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default ShoppingListPurchaseDrawer;
