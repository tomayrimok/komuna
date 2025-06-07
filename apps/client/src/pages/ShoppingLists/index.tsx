import { Tabs } from '@chakra-ui/react';
import { IconHome, IconUser } from '@tabler/icons-react';
import { ContextType } from '@komuna/types';
import { ShoppingListProvider } from '../../context/auth/ShoppingListProvider';
import ShoppingListPage from './ShoppingListPage';
import { useTranslation } from 'react-i18next';

const CurrentShoppingLists = () => {
  const { t } = useTranslation();

  return (
    <Tabs.Root defaultValue="apartment" h="100dvh" display={'flex'} flexDirection="column" size="lg" padding={2}>
      <Tabs.List>
        <Tabs.Trigger value="apartment">
          <IconHome />
          {t('shopping.apartment')}
        </Tabs.Trigger>
        <Tabs.Trigger value="personal">
          <IconUser />
          {t('shopping.personal')}
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="apartment" flexGrow={1}>
        <ShoppingListProvider contextType={ContextType.APARTMENT}>
          <ShoppingListPage />
        </ShoppingListProvider>
      </Tabs.Content>
      <Tabs.Content value="personal" flexGrow={1}>
        <ShoppingListProvider contextType={ContextType.USER}>
          <ShoppingListPage />
        </ShoppingListProvider>
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default CurrentShoppingLists;
