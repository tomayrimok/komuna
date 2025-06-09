import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { AddEditExpenseDto, ApartmentExpensesResponse } from './dto/expense.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { Expense } from './expense.entity';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) { }

  @Get('apartment-expenses')
  @ApiOkResponse({ type: [ApartmentExpensesResponse] })
  async getApartmentExpenses(@Query('apartmentId') apartmentId: string, @Query('userId') userId: string) {
    return await this.expenseService.getApartmentExpenses(apartmentId, userId);
  }

  @Post('add-edit-expense')
  async addEditExpense(@Body() body: AddEditExpenseDto) {
    return await this.expenseService.addEditExpense(body);
  }

  @Get('expense-details')
  @ApiOkResponse({ type: Expense })
  async getExpenseDetails(@Query('expenseId') expenseId: string) {
    return await this.expenseService.getExpenseDetails(expenseId);
  }
}
