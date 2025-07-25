import { Box, Flex, Tabs } from '@chakra-ui/react';
import { IconHome, IconUser } from '@tabler/icons-react';
import { ContextType } from '@komuna/types';
import { useShoppingList } from '../../context/auth/ShoppingListProvider';
import ShoppingListPage from './ShoppingListPage';
import { useTranslation } from 'react-i18next';
import ApartmentLayout from '../NewApartment/ApartmentLayout';

const CurrentShoppingLists = () => {
  const { t } = useTranslation();
  const { contextType, setContextType } = useShoppingList();

  return (
    <Tabs.Root
      value={contextType}
      variant="plain"
      h="100vh"
      overflow={"hidden"}
      onValueChange={(e) => {
        setContextType(e.value as ContextType);
      }}
    >
      <ApartmentLayout
        containerProps={{ pb: '110px', pt: 2 }}
        header={
          <Flex alignSelf={"center"} mt={4} backgroundColor={"rgba(255,255,255,0.2)"} borderRadius={"full"} p={1.5}>
            <Tabs.List >
              <Tabs.Trigger value={ContextType.APARTMENT} color={'brand.900'}>
                <IconHome />
                {t('shopping.apartment')}
              </Tabs.Trigger>
              <Tabs.Trigger value={ContextType.USER} color={'brand.900'}>
                <IconUser />
                {t('shopping.personal')}
              </Tabs.Trigger>
              <Tabs.Indicator rounded="full" />
            </Tabs.List>
          </Flex>
        }>
        <Box h="fit-content">
          <Tabs.Content value={ContextType.APARTMENT} flexGrow={1}>
            <ShoppingListPage />
          </Tabs.Content>
          <Tabs.Content value={ContextType.USER} flexGrow={1}>
            <ShoppingListPage />
          </Tabs.Content>
        </Box>
      </ApartmentLayout>
    </Tabs.Root>
  );
};

export default CurrentShoppingLists;
