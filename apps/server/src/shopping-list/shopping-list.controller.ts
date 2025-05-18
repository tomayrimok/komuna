import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { UseAuth } from '../decorators/UseAuth';
import { User } from '../decorators/User';
import { UserJwtPayload } from '../user/dto/jwt-user.dto';
import { ShoppingListContextType, ShoppingListItemDto } from '@komuna/types';

@Controller('shopping-list')
export class ShoppingListController {
    constructor(
        private readonly shoppingListService: ShoppingListService,
    ) { }

    @Get('apartment')
    @UseAuth()
    async getApartmentShoppingList(@User() user: UserJwtPayload) {
        return this.shoppingListService.getApartmentShoppingList(user.apartmentId);
    }

    @Get('personal')
    @UseAuth()
    async getPersonalShoppingList(@User() user: UserJwtPayload) {
        return this.shoppingListService.getPersonalShoppingList(user.userId);
    }

    @Post('add-item')
    @UseAuth()
    async addItemToApartmentShoppingList(@User() user: UserJwtPayload, @Body('itemData') itemData: ShoppingListItemDto, @Body('contextType') contextType: ShoppingListContextType) {
        return this.shoppingListService.addItemToShoppingList(contextType, user.apartmentId || '60514c72-5b94-417f-b4a3-9da2092a267f', user.userId, itemData);
    }

    @Post('delete-item')
    @UseAuth()
    async addItemToPersonalShoppingList(@User() user: UserJwtPayload, @Body('itemId') itemId: string, @Body('contextType') contextType: ShoppingListContextType) {
        return this.shoppingListService.removeItemFromShoppingList(contextType, user.apartmentId || '60514c72-5b94-417f-b4a3-9da2092a267f', user.userId, itemId);
    }

    @Post('update-item')
    @UseAuth()
    async updateItemInApartmentShoppingList(@User() user: UserJwtPayload, @Body('itemId') itemId: string, @Body('itemData') itemData: Partial<ShoppingListItemDto>, @Body('contextType') contextType: ShoppingListContextType) {
        return this.shoppingListService.updateItemInShoppingList(contextType, user.apartmentId || '60514c72-5b94-417f-b4a3-9da2092a267f', user.userId, itemId, itemData);
    }

    @Post('clear')
    @UseAuth()
    async clearShoppingList(@User() user: UserJwtPayload, @Body('contextType') contextType: ShoppingListContextType) {
        return this.shoppingListService.clearShoppingList(contextType, user.apartmentId || '60514c72-5b94-417f-b4a3-9da2092a267f', user.userId);
    }

    @Post('mark-all-as-purchased')
    @UseAuth()
    async markAllAsPurchased(@User() user: UserJwtPayload, @Body('contextType') contextType: ShoppingListContextType) {
        return this.shoppingListService.markAllItemsAsPurchased(contextType, user.apartmentId || '60514c72-5b94-417f-b4a3-9da2092a267f', user.userId);
    }

}
