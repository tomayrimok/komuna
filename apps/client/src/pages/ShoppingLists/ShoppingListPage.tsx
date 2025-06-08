import { useEffect } from 'react';
import { Flex, Image, Loader, Text, VStack } from '@chakra-ui/react';
import { Reorder } from 'framer-motion';
import { ShoppingListItem } from '../../components/ShoppingList/shoppingListItem';
import { useShoppingList } from '../../context/auth/ShoppingListProvider';
import { useTranslation } from 'react-i18next';
import ShoppingListPurchaseDrawer from '../../components/ShoppingList/shoppingListPurchaseDrawer';
import { SearchGroceryInput } from '../../components/ShoppingList/SearchGroceryInput';

const ShoppingListPage: React.FC = () => {
  const { items, updateOrder, openEditDrawer, isFetching, setPurchaseItems } = useShoppingList();
  const { t } = useTranslation();

  useEffect(() => {
    setPurchaseItems([]);
  }, []);

  return (
    <Flex p={8} flexDirection={'column'} py={4} h="100%" pb={14}>
      <Flex mb={4}>
        <SearchGroceryInput />
      </Flex>
      <ShoppingListPurchaseDrawer />

      <Reorder.Group axis="y" values={items} onReorder={updateOrder}>
        {items.map((item) => {
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
