import { Controller, Get, Query } from '@nestjs/common';
import { DebtEdgeService } from './debt-edge.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { DebtEdge } from './debt-edge.entity';
import { DebtEdgeWithDebtor } from './dto/debt-edge.dto';

@Controller('debt-edge')
export class DebtEdgeController {
    constructor(
        private readonly debtEdgeService: DebtEdgeService,
    ) { }

    @Get('user-balance-details')
    @ApiOkResponse({ type: [DebtEdgeWithDebtor] }) // Adjust the type as necessary
    async getUserBalanceDetails(@Query('userId') userId: string, @Query('apartmentId') apartmentId: string) {
        return await this.debtEdgeService.getUserBalanceDetails(apartmentId, userId);
    }

    @Get('user-balance')
    @ApiOkResponse({ type: Number })
    async getUserBalance(@Query('userId') userId: string, @Query('apartmentId') apartmentId: string) {
        return await this.debtEdgeService.getUserBalance(apartmentId, userId);
    }

    @Get('debt-details')
    @ApiOkResponse({ type: DebtEdge }) // Adjust the type as necessary
    async getDebtDetails(@Query('debtId') debtId: string) {
        return await this.debtEdgeService.getDebtDetails(debtId);
    }
}
