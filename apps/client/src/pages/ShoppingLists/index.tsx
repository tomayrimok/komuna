import { Tabs } from "@chakra-ui/react";
import { IconHome, IconUser } from "@tabler/icons-react";
import ShoppingListPage from "./ShoppingListPage";
import { useTranslation } from "react-i18next";
import { ShoppingListContextType } from "@komuna/types";
import { useShoppingList } from "../../context/auth/ShoppingListProvider";

const CurrentShoppingLists = () => {

  const { t } = useTranslation();
  const { contextType, setContextType } = useShoppingList();

  return (

    <Tabs.Root
      defaultValue={contextType}
      h="100dvh"
      display={"flex"}
      flexDirection="column"
      onValueChange={(e) => {
        setContextType(e.value as ShoppingListContextType);
      }}
    >

      <Tabs.List>
        <Tabs.Trigger value={ShoppingListContextType.APARTMENT}>
          <IconHome />
          {t('shopping.apartment')}
        </Tabs.Trigger>
        <Tabs.Trigger value={ShoppingListContextType.USER}>
          <IconUser />
          {t('shopping.personal')}
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value={ShoppingListContextType.APARTMENT} flexGrow={1}>
        <ShoppingListPage />
      </Tabs.Content>
      <Tabs.Content value={ShoppingListContextType.USER} flexGrow={1}>
        <ShoppingListPage />
      </Tabs.Content>

    </Tabs.Root>

  );
};

export default CurrentShoppingLists;