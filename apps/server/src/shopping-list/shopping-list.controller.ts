import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { UseAuth } from '../decorators/UseAuth';
import { User } from '../decorators/User';
import { UserJwtPayload } from '../user/dto/jwt-user.dto';
import { ShoppingListContextType } from '@komuna/types';
import { ApiOkResponse } from '@nestjs/swagger';
import { ShoppingList } from './shopping-list.entity';
import { AddItemDto, changeOrderDto, DeleteItemDto, UpdateItemDto } from './dto/shopping-list.dto';
import axios from 'axios';
import { GroceryItem, SearchGroceryResponse } from './dto/search-grocery.dto';

const API_URL = 'https://www.shufersal.co.il/online/he';
const DEPARTMENT = `departments:A`;

@Controller('shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

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
    return await this.shoppingListService.updateItemInShoppingList(
      contextType,
      user.apartmentId,
      user.userId,
      itemId,
      itemData
    );
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

  @Get('search-item')
  @ApiOkResponse({
    type: SearchGroceryResponse,
  })
  async searchItem(@Query('query') query: string) {
    try {
      const { data } = await axios.get<{ results: Record<string, any>[] }>(
        `${API_URL}/search/results?q=${query}:relevance:${DEPARTMENT}&limit=10`
      );
      const items: GroceryItem[] = data.results.map(
        (item) =>
          ({
            id: item.code,
            description: item.description,
            formattedPrice: item.price?.formattedValue,
            image: item.baseProductImageLarge,
            category: item.secondLevelCategory,
            priceForUnit: item.unitForComparison,
          } satisfies GroceryItem)
      );
      return { items };
    } catch (error) {
      console.error('Error while fetching grocery items', error);
      throw error;
    }
  }
}
