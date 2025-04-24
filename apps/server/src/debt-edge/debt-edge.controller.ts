import { Controller, Get, Query } from '@nestjs/common';
import { DebtEdgeService } from './debt-edge.service';

@Controller('debt-edge')
export class DebtEdgeController {
    constructor(
        private readonly debtEdgeService: DebtEdgeService,
    ) { }

    @Get('user-balance-details')
    async getUserBalanceDetails(@Query('userId') userId: string, @Query('apartmentId') apartmentId: string) {
        return await this.debtEdgeService.getUserBalanceDetails(apartmentId, userId);
    }

    @Get('user-balance')
    async getUserBalance(@Query('userId') userId: string, @Query('apartmentId') apartmentId: string) {
        return await this.debtEdgeService.getUserBalance(apartmentId, userId);
    }
}
