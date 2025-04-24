import { Controller, Get, Query } from '@nestjs/common';
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

    // @Post('create-expense')
    // async createExpense(@Body() createDto: DeepPartial<Expense>, @User() user: User) {
    //     return await this.expenseService.createExpense(createDto, user.userId);
    // }
}
