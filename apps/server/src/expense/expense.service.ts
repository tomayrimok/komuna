import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { DebtEdgeService } from '../debt-edge/debt-edge.service';

@Injectable()
export class ExpenseService {

    constructor(
        @InjectRepository(Expense)
        private readonly expenseRepo: Repository<Expense>,
        private readonly debtEdgeService: DebtEdgeService,
    ) { }

    async createExpense(createDto,
        // : CreateExpenseDto, 
        userId: string) {
        const { apartmentId, description, amount, splits } = createDto;

        const expense = this.expenseRepo.create({
            apartmentId,
            description,
            amount,
            paidBy: userId,
            splits,
        });

        await this.expenseRepo.save(expense);

        for (const split of splits) {
            if (split.userId === userId) continue;
            await this.debtEdgeService.updateDebt(apartmentId, split.userId, userId, split.amount);
        }

        return expense;
    }
}
