import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ExpenseService } from './expense.service';

@Controller('expense')
export class ExpenseController {

    constructor(
        private readonly expenseService: ExpenseService,
    ) { }

    @Get('apartment-expenses')
    async getApartmentExpenses(@Query('apartmentId') apartmentId: string, @Query('userId') userId: string) {
        return await this.expenseService.getApartmentExpenses(apartmentId, userId);
    }

    @Post('create-expense')
    async createExpense(@Body('apartmentId') apartmentId: string, @Body('splits') splits: any, @Body('amount') amount: number, @Body('description') description: string, @Body('userId') userId: string) {
        return await this.expenseService.createExpense({
            apartmentId,
            splits,
            amount,
            description
        }, userId
        );
    }
}
