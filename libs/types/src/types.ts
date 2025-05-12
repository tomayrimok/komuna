import { ShoppingListItemDto } from "./dto";
import { ShoppingListContextType } from "./enums";

export type ShoppingList = {

    shoppingListId: string;

    contextType: ShoppingListContextType;

    contextId: string;

    items: ShoppingListItemDto[];

    updatedAt: Date;

    createdAt: Date;
}