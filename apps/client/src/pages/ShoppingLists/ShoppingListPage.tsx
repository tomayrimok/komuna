import { Flex, Icon, Loader, Text } from '@chakra-ui/react';
import { IconShoppingCart } from '@tabler/icons-react';
import { Reorder } from 'framer-motion';
import { ShoppingListItem } from '../../components/ShoppingList/shoppingListItem';
import { useShoppingList } from '../../context/auth/ShoppingListProvider';
import { useTranslation } from 'react-i18next';
import { SearchGroceryInput } from '../../components/ShoppingList/SearchGroceryInput';

const ShoppingListPage: React.FC = () => {
  const { items, updateOrder, openEditDrawer, isShoppingListLoading } = useShoppingList();

  const { t } = useTranslation();

  return (
    <Flex p={8} flexDirection={'column'} py={4} h="100%">
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          {t('shopping.shopping_list')}
        </Text>
      </Flex>
      <Flex mb={4}>
        <SearchGroceryInput />
      </Flex>

      <Reorder.Group axis="y" values={items} onReorder={updateOrder}>
        {items.map((item) => {
          return (
            <Reorder.Item key={item.itemId} value={item}>
              <ShoppingListItem key={item.itemId} item={item} openEditDrawer={openEditDrawer} />
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {isShoppingListLoading ? (
        <Flex direction="column" align="center" justify="center" h="200px" color="gray.500">
          <Loader />
        </Flex>
      ) : (
        items.length === 0 && (
          <Flex direction="column" align="center" justify="center" color="gray.500" flexGrow={1}>
            <Icon width={16} height={16} mb={3}>
              <IconShoppingCart />
            </Icon>
            <Text mb={3}>{t('shopping.list_is_empty')}</Text>
          </Flex>
        )
      )}
    </Flex>
  );
};

export default ShoppingListPage;
