import { Tabs } from '@chakra-ui/react';
import { IconHome, IconUser } from '@tabler/icons-react';
import { ContextType } from '@komuna/types';
import { useShoppingList } from '../../context/auth/ShoppingListProvider';
import ShoppingListPage from './ShoppingListPage';
import { useTranslation } from 'react-i18next';

const CurrentShoppingLists = () => {
  const { t } = useTranslation();
  const { contextType, setContextType } = useShoppingList();

  return (
    <Tabs.Root
      value={contextType}
      h="100dvh"
      display={'flex'}
      flexDirection="column"
      size="lg"
      padding={2}
      onValueChange={(e) => {
        setContextType(e.value as ContextType);
      }}
    >
      <Tabs.List>
        <Tabs.Trigger value={ContextType.APARTMENT} color={'brand.900'}>
          <IconHome />
          {t('shopping.apartment')}
        </Tabs.Trigger>
        <Tabs.Trigger value={ContextType.USER} color={'brand.900'}>
          <IconUser />
          {t('shopping.personal')}
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value={ContextType.APARTMENT} flexGrow={1}>
        <ShoppingListPage />
      </Tabs.Content>
      <Tabs.Content value={ContextType.USER} flexGrow={1}>
        <ShoppingListPage />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default CurrentShoppingLists;
