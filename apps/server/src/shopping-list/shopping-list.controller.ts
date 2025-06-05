import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { UseAuth } from '../decorators/UseAuth';
import { User } from '../decorators/User';
import { UserJwtPayload } from '../user/dto/jwt-user.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { ShoppingList } from './shopping-list.entity';
import axios from 'axios';
import { GroceryItem, SearchGroceryResponse } from './dto/search-grocery.dto';
import { GetListDto, SyncListDto } from './dto/shopping-list.dto';

const API_URL = 'https://www.shufersal.co.il/online/he';
const DEPARTMENT = `departments:A`;

@Controller('shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

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

  // @Post('clear')
  // @UseAuth()
  // async clearShoppingList(@User() user: UserJwtPayload, @Body('contextType') contextType: ContextType) {
  //     return this.shoppingListService.clearShoppingList(contextType, apartmentId, user.userId);
  // }

  // @Post('mark-all-as-purchased')
  // @UseAuth()
  // async markAllAsPurchased(@User() user: UserJwtPayload, @Body('contextType') contextType: ContextType) {
  //     return this.shoppingListService.markAllItemsAsPurchased(contextType, apartmentId, user.userId);
  // }
}
