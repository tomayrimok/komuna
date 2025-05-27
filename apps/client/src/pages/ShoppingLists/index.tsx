import { Tabs } from "@chakra-ui/react";
import { usePersonalShoppingList } from "../../hooks/query/usePersonalShoppingList";
import { IconHome, IconUser } from "@tabler/icons-react";
import { ShoppingListContextType } from "@komuna/types";
import { ShoppingListProvider } from "../../context/auth/ShoppingListProvider";
import ShoppingListPage from "./ShoppingListPage";

const CurrentShoppingLists = () => {

  // const { apartmentShoppingList, isApartmentShoppingListLoading } = useApartmentShoppingList();
  // const { personalShoppingList, isPersonalShoppingListLoading } = usePersonalShoppingList();

  return (
    // <div>
    <Tabs.Root defaultValue="apartment" h="100dvh" display={"flex"} flexDirection="column">
      <Tabs.List>
        <Tabs.Trigger value="apartment">
          <IconHome />
          Apartment
        </Tabs.Trigger>
        <Tabs.Trigger value="personal">
          <IconUser />
          Personal
        </Tabs.Trigger>
        {/* <Tabs.Indicator /> */}
      </Tabs.List>
      <Tabs.Content value="apartment" flexGrow={1}>
        <ShoppingListProvider contextType={ShoppingListContextType.APARTMENT}>
          <ShoppingListPage />
        </ShoppingListProvider>
      </Tabs.Content>

      <Tabs.Content value="personal" flexGrow={1}>
        <ShoppingListProvider contextType={ShoppingListContextType.USER}>
          <ShoppingListPage />
        </ShoppingListProvider>
      </Tabs.Content>

    </Tabs.Root>
    // </div>
  );
};

export default CurrentShoppingLists;