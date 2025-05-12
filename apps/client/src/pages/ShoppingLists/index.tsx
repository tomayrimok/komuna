import { Tabs } from "@chakra-ui/react";
import { useApartmentShoppingList } from "../../hooks/query/useApartmentShoppingList";
import { usePersonalShoppingList } from "../../hooks/query/usePersonalShoppingList";
import { IconHome, IconUser } from "@tabler/icons-react";
import { ShoppingListPage } from "./ShoppingListPage";
import { ShoppingListContextType } from "@komuna/types";

const CurrentShoppingLists = () => {

  const { apartmentShoppingList, isApartmentShoppingListLoading } = useApartmentShoppingList();
  const { personalShoppingList, isPersonalShoppingListLoading } = usePersonalShoppingList();

  return (
    <div>
      <Tabs.Root defaultValue="apartment" variant="plain">
        <Tabs.List bg="bg.muted" rounded="l3" p="1">
          <Tabs.Trigger value="apartment">
            <IconHome />
            Apartment
          </Tabs.Trigger>
          <Tabs.Trigger value="personal">
            <IconUser />
            Personal
          </Tabs.Trigger>
          <Tabs.Indicator rounded="l2" />
        </Tabs.List>
        {!isApartmentShoppingListLoading &&
          <Tabs.Content value="apartment">
            <ShoppingListPage contextType={ShoppingListContextType.APARTMENT} data={apartmentShoppingList} />
          </Tabs.Content>
        }
        {!isPersonalShoppingListLoading &&
          <Tabs.Content value="personal">
            <ShoppingListPage contextType={ShoppingListContextType.USER} data={personalShoppingList} />
          </Tabs.Content>
        }
      </Tabs.Root>
    </div>
  );
};

export default CurrentShoppingLists;