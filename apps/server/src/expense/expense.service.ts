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

        const expenseData = this.expenseRepo.create({
            apartmentId,
            description,
            amount,
            paidById: userId,
            splits,
        });

        const expense = await this.expenseRepo.save(expenseData);

        // Update the debts of the users involved in the expense
        Object.entries(splits).forEach(([fromId, amount]) => {
            this.debtEdgeService.updateDebt(apartmentId, fromId, userId, amount);
        });

        return expense;
    }

    async getApartmentExpenses(apartmentId: string, userId: string) {
        return this.expenseRepo
            .createQueryBuilder('expense')
            .select([
                'expense',
                `expense.splits ->> :userId AS "splitAmount"`,
                `"expense"."paidById"::uuid = :userId::uuid AS "paidByMe"`,
                'paidByUser.firstName AS "paidByFirstName"',
                'paidByUser.lastName AS "paidByLastName"'
            ])
            .leftJoin('expense.paidByUser', 'paidByUser')
            .where('expense.apartmentId = :apartmentId', { apartmentId })
            .setParameters({ userId })
            .getRawMany();
    }



}
