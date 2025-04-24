import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { DebtEdgeService } from '../debt-edge/debt-edge.service';

@Injectable()
export class ExpenseService {

    constructor(
        @InjectRepository(Expense)
        private readonly expenseRepo: Repository<Expense>,
        private readonly debtEdgeService: DebtEdgeService,
    ) { }

    // This method creates a new expense and updates the debts of the users involved in the expense.
    // for example, if some member bought groceries for the group, the method will create an expense for this purchase,
    // and update the debts of the other members in the group.
    async createExpense(createDto: DeepPartial<Expense>, userId: string) { //todo noam add dto validation
        const { apartmentId, description, amount, splits } = createDto;

        const expense = this.expenseRepo.create({
            apartmentId,
            description,
            amount,
            paidById: userId,
            splits,
        });

        await this.expenseRepo.save(expense);

        for (const split of splits) {
            if (split.userId === userId) continue;
            await this.debtEdgeService.updateDebt(apartmentId, split.userId, userId, split.amount);
        }

        return expense;
    }

    getApartmentExpenses(apartmentId: string, userId: string) {
        return this.expenseRepo.find({
            where: {
                apartmentId,
            },
            relations: {
                splits: true,
            },
        });
    }
}
