import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { UseAuth } from '../decorators/UseAuth';
import { User } from '../decorators/User';
import { UserJwtPayload } from '../user/dto/jwt-user.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { ShoppingList } from './shopping-list.entity';
import { GetListDto, SyncListDto } from './dto/shopping-list.dto';

@Controller('shopping-list')
export class ShoppingListController {
    constructor(
        private readonly shoppingListService: ShoppingListService,
    ) { }


    @Get()
    @ApiOkResponse({ type: ShoppingList })
    @UseAuth()
    async getShoppingList(@User() user: UserJwtPayload, @Query() query: GetListDto) {
        return this.shoppingListService.getShoppingList(user.userId, query.contextType);
    }

    @Post('sync-items')
    @ApiOkResponse({ type: ShoppingList })
    @UseAuth()
    async syncItems(@User() user: UserJwtPayload, @Body() body: SyncListDto) {
        const { contextType, items, apartmentId } = body;
        return await this.shoppingListService.syncShoppingList(contextType, apartmentId, user.userId, items);
    }

    // @Post('clear')
    // @UseAuth()
    // async clearShoppingList(@User() user: UserJwtPayload, @Body('contextType') contextType: ShoppingListContextType) {
    //     return this.shoppingListService.clearShoppingList(contextType, apartmentId, user.userId);
    // }

    // @Post('mark-all-as-purchased')
    // @UseAuth()
    // async markAllAsPurchased(@User() user: UserJwtPayload, @Body('contextType') contextType: ShoppingListContextType) {
    //     return this.shoppingListService.markAllItemsAsPurchased(contextType, apartmentId, user.userId);
    // }


}
