import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UseAuth } from '../decorators/UseAuth';
import { User as GetUser } from '../decorators/User';
import { User } from '../user/user.entity';
import { GeneralShoppingListService } from './general-shopping-list.service';
import {
    CreateGeneralShoppingListDto,
    UpdateGeneralShoppingListDto,
    GenerateShoppingListFromTemplateDto
} from './dto/general-shopping-list.dto';
import { GeneralShoppingList } from './general-shopping-list.entity';

@ApiTags('General Shopping Lists')
@Controller('general-shopping-list')
export class GeneralShoppingListController {
    constructor(private readonly generalShoppingListService: GeneralShoppingListService) { }

    @Post('create')
    @UseAuth()
    @ApiOkResponse({ type: GeneralShoppingList })
    async createGeneralShoppingList(
        @Body() dto: CreateGeneralShoppingListDto,
        @GetUser() user: User
    ): Promise<GeneralShoppingList> {
        return await this.generalShoppingListService.createGeneralShoppingList(dto, user.userId);
    }

    @Post('update')
    @UseAuth()
    @ApiOkResponse({ type: GeneralShoppingList })
    async updateGeneralShoppingList(
        @Body() dto: UpdateGeneralShoppingListDto
    ): Promise<GeneralShoppingList> {
        return await this.generalShoppingListService.updateGeneralShoppingList(dto);
    }

    @Get('list')
    @UseAuth()
    @ApiOkResponse({ type: [GeneralShoppingList] })
    async getGeneralShoppingLists(
        @Query('apartmentId') apartmentId: string
    ): Promise<GeneralShoppingList[]> {
        return await this.generalShoppingListService.getGeneralShoppingLists(apartmentId);
    }

    @Get('details')
    @UseAuth()
    @ApiOkResponse({ type: GeneralShoppingList })
    async getGeneralShoppingListById(
        @Query('generalShoppingListId') generalShoppingListId: string
    ): Promise<GeneralShoppingList | null> {
        return await this.generalShoppingListService.getGeneralShoppingListById(generalShoppingListId);
    }

    @Delete('delete')
    @UseAuth()
    @ApiOkResponse()
    async deleteGeneralShoppingList(
        @Query('generalShoppingListId') generalShoppingListId: string
    ): Promise<void> {
        return await this.generalShoppingListService.deleteGeneralShoppingList(generalShoppingListId);
    }

    @Post('generate')
    @UseAuth()
    @ApiOkResponse()
    async generateFromTemplate(
        @Body() dto: GenerateShoppingListFromTemplateDto
    ): Promise<void> {
        return await this.generalShoppingListService.manuallyGenerateFromTemplate(dto);
    }

    @Post('duplicate')
    @UseAuth()
    @ApiOkResponse({ type: GeneralShoppingList })
    async duplicateGeneralShoppingList(
        @Query('generalShoppingListId') generalShoppingListId: string,
        @GetUser() user: User
    ): Promise<GeneralShoppingList> {
        return await this.generalShoppingListService.duplicateGeneralShoppingList(generalShoppingListId, user);
    }
} 