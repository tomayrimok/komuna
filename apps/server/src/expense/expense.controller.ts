import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { AddEditExpenseDto } from './dto/expense.dto';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get('apartment-expenses')
  async getApartmentExpenses(@Query('apartmentId') apartmentId: string, @Query('userId') userId: string) {
    return await this.expenseService.getApartmentExpenses(apartmentId, userId);
  }

  @Post('add-edit-expense')
  async addEditExpense(@Body() body: AddEditExpenseDto) {
    const { expenseId, apartmentId, splits, amount, description, paidById } = body;
    return await this.expenseService.addEditExpense({
      expenseId,
      apartmentId,
      splits,
      amount,
      description,
      paidById,
    });
  }

  @Get('expense-details')
  async getExpenseDetails(@Query('expenseId') expenseId: string) {
    return await this.expenseService.getExpenseDetails(expenseId);
  }
}
