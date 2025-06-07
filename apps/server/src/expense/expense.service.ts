import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DebtEdgeService } from '../debt-edge/debt-edge.service';
import { Expense } from './expense.entity';
import { AddEditExpenseDto } from './dto/expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
    private readonly debtEdgeService: DebtEdgeService
  ) {}

  // This method creates a new expense and updates the debts of the users involved in the expense.
  // for example, if some member bought groceries for the group, the method will create an expense for this purchase,
  // and update the debts of the other members in the group.
  async addEditExpense(expense: AddEditExpenseDto) {
    const { expenseId, apartmentId, description, amount, splits, paidById, splitType } = expense;
    const data = { apartmentId, description, amount, paidById, splits, splitType };

    if (!description || !amount || !splits || !paidById || !apartmentId || !splitType) {
      throw new BadRequestException('Missing required fields', {
        description: 'חסרים שדות חובה',
      });
    }

    if (!expenseId) {
      return await this.createExpense(data);
    } else {
      return await this.updateExpense(expenseId, data);
    }
  }

  async createExpense(updateData: AddEditExpenseDto) {
    const expenseData = this.expenseRepo.create(updateData);
    const expense = await this.expenseRepo.save(expenseData);
    for (const [fromId, amount] of Object.entries(updateData.splits)) {
      await this.debtEdgeService.updateDebt(updateData.apartmentId, fromId, updateData.paidById, amount);
    }
    return expense;
  }

  async updateExpense(expenseId: string, updateData: AddEditExpenseDto) {
    const expense = await this.expenseRepo.findOne({ where: { expenseId } });
    if (!expense) {
      throw new Error('Expense not found');
    }
    await this.expenseRepo.update(expenseId, updateData);
    const oldSplits = expense.splits;
    const newSplits = updateData.splits;
    const allUserIds = new Set([...Object.keys(oldSplits), ...Object.keys(newSplits)]);

    for (const userId of allUserIds) {
      const oldAmount = oldSplits[userId] || 0;
      const newAmount = newSplits[userId] || 0;
      const diff = newAmount - oldAmount;
      if (diff !== 0) {
        await this.debtEdgeService.updateDebt(updateData.apartmentId, userId, updateData.paidById, diff);
      }
    }

    return expense;
  }

  async getApartmentExpenses(apartmentId: string, userId: string) {
    const expenses = await this.expenseRepo.find({
      where: { apartmentId },
      relations: ['paidByUser'],
      order: { createdAt: 'DESC' },
    });

    return expenses.map((expense) => ({
      ...expense,
      splitAmount: expense.splits[userId] ?? 0,
      paidByMe: expense.paidByUser?.userId === userId,
    }));
  }

  async getExpenseDetails(expenseId: string) {
    // First get the expense with paidByUser as a relation
    const expenseWithRelations = await this.expenseRepo
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.paidByUser', 'paidByUser')
      .where('expense.expenseId = :expenseId', { expenseId })
      .getOne();

    // If no expense found, return null
    if (!expenseWithRelations) {
      return null;
    }

    // Transform the data to get the structure you want
    const result = {
      ...expenseWithRelations,
      paidByUser: {
        firstName: expenseWithRelations.paidByUser.firstName,
        lastName: expenseWithRelations.paidByUser.lastName,
        image: expenseWithRelations.paidByUser.image,
        phoneNumber: expenseWithRelations.paidByUser.phoneNumber,
        userId: expenseWithRelations.paidByUser.userId,
      },
    };

    return result;
  }
}
