import { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Heading, Icon, Image, Loader, Text, VStack } from '@chakra-ui/react';
import { Reorder } from 'framer-motion';
import { ShoppingListItem } from '../../components/ShoppingList/shoppingListItem';
import { useShoppingList } from '../../context/auth/ShoppingListProvider';
import { useTranslation } from 'react-i18next';
import ShoppingListPurchaseDrawer from '../../components/ShoppingList/shoppingListPurchaseDrawer';
import { SearchGroceryInput } from '../../components/ShoppingList/SearchGroceryInput';
import { ApiTypes } from '@komuna/types';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

const ShoppingListPage: React.FC = () => {
  const { items, updateOrder, openEditDrawer, isFetching, setPurchaseItems, handleAddItem, togglePurchased, contextType } = useShoppingList();
  const { t } = useTranslation();
  const [hidePurchased, setHidePurchased] = useState((localStorage.getItem('hidePurchased') === 'true'));

  useEffect(() => {
    localStorage.setItem('hidePurchased', hidePurchased.toString());
  }, [hidePurchased]);

  useEffect(() => {
    setPurchaseItems?.([]);
  }, [contextType]);

  const filteredItems = items.filter((item) => hidePurchased ? !item.isPurchased : true);


  return (
    <Flex p={4} flexDirection={'column'} py={4} h="100%" pb={14}>
      <Heading mb={2} display={'flex'} justifyContent={'space-between'} alignItems={'end'}>
        {t('shopping.shopping_list')}
        {togglePurchased ?
          <Button onClick={() => setHidePurchased(!hidePurchased)} variant="ghost" size="2xs" w="fit-content" borderRadius={'full'}>
            <Icon as={hidePurchased ? IconEye : IconEyeOff} />
            {hidePurchased ? t('shopping.show-purchased') : t('shopping.hide-purchased')}
          </Button>
          : null}

      </Heading>
      <Flex mb={4}>
        <SearchGroceryInput handleAddItem={handleAddItem} />
      </Flex>
      <ShoppingListPurchaseDrawer />



      <Reorder.Group axis="y" values={items} onReorder={updateOrder}>
        {filteredItems.map((item) => {
          return (
            <Reorder.Item key={item.itemId} value={item}>
              <ShoppingListItem key={item.itemId} item={item} openEditDrawer={openEditDrawer} />
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {isFetching ? (
        <Flex direction="column" align="center" justify="center" h="200px" color="gray.500">
          <Loader />
        </Flex>
      ) : (
        items.length === 0 && (
          <Flex direction="column" align="center" justify="center" color="brand.900" flexGrow={1}>
            <Image src="/meerkats/shopping.png" width="50vw" />
            <VStack gap="2">
              <Text fontSize="lg" fontWeight="semibold">
                {t('shopping.list_is_empty')}
              </Text>
              <Text fontWeight="semibold">{t('shopping.wanna_buy')}</Text>
            </VStack>
          </Flex>
        )
      )}
    </Flex>
  );
};

export default ShoppingListPage;
