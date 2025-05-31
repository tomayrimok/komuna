import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { UseAuth } from '../decorators/UseAuth';
import { User } from '../decorators/User';
import { UserJwtPayload } from '../user/dto/jwt-user.dto';
import { ShoppingListContextType } from '@komuna/types';
import { ApiOkResponse } from '@nestjs/swagger';
import { ShoppingList } from './shopping-list.entity';
import { AddItemDto, changeOrderDto, DeleteItemDto, UpdateItemDto } from './dto/shopping-list.dto';

@Controller('shopping-list')
export class ShoppingListController {
    constructor(
        private readonly shoppingListService: ShoppingListService,
    ) { }

    @Get('apartment')
    @ApiOkResponse({ type: ShoppingList })
    @UseAuth()
    async getApartmentShoppingList(@User() user: UserJwtPayload) {
        return this.shoppingListService.getApartmentShoppingList(user.apartmentId);
    }

    @Get('personal')
    @ApiOkResponse({ type: ShoppingList })
    @UseAuth()
    async getPersonalShoppingList(@User() user: UserJwtPayload) {
        return this.shoppingListService.getPersonalShoppingList(user.userId);
    }

    @Post('add-item')
    @ApiOkResponse({ type: ShoppingList })
    @UseAuth()
    async addItem(@Body() body: AddItemDto, @User() user: UserJwtPayload) {
        const { itemData, contextType } = body;
        return this.shoppingListService.addItemToShoppingList(contextType, user.apartmentId, user.userId, itemData);
    }

    @Post('delete-item')
    @ApiOkResponse({ type: ShoppingList })
    @UseAuth()
    async deleteItem(@User() user: UserJwtPayload, @Body() body: DeleteItemDto) {
        const { itemId, contextType } = body;
        return this.shoppingListService.removeItemFromShoppingList(contextType, user.apartmentId, user.userId, itemId);
    }

    @Post('update-item')
    @ApiOkResponse({ type: ShoppingList })
    @UseAuth()
    async updateItem(@User() user: UserJwtPayload, @Body() body: UpdateItemDto) {
        const { itemId, itemData, contextType } = body;
        return await this.shoppingListService.updateItemInShoppingList(contextType, user.apartmentId, user.userId, itemId, itemData);
    }

    @Post('clear')
    @UseAuth()
    async clearShoppingList(@User() user: UserJwtPayload, @Body('contextType') contextType: ShoppingListContextType) {
        return this.shoppingListService.clearShoppingList(contextType, user.apartmentId, user.userId);
    }

    @Post('mark-all-as-purchased')
    @UseAuth()
    async markAllAsPurchased(@User() user: UserJwtPayload, @Body('contextType') contextType: ShoppingListContextType) {
        return this.shoppingListService.markAllItemsAsPurchased(contextType, user.apartmentId, user.userId);
    }

    @Post('change-order')
    @UseAuth()
    async changeOrder(@User() user: UserJwtPayload, @Body() body: changeOrderDto) {
        const { itemIds, contextType } = body;
        return this.shoppingListService.changeOrder(contextType, user.apartmentId, user.userId, itemIds);
    }

}
