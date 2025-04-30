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
    async addEditExpense(createDto: DeepPartial<Expense>) { //todo noam add dto validation
        const { expenseId, apartmentId, description, amount, splits, paidById } = createDto;
        const data = { apartmentId, description, amount, paidById, splits }

        if (!expenseId) {
            return await this.createExpense(data);
        } else {
            return await this.updateExpense(expenseId, data);
        }
    }

    async createExpense(updateData: DeepPartial<Expense>) {
        const expenseData = this.expenseRepo.create(updateData);
        const expense = await this.expenseRepo.save(expenseData);
        Object.entries(updateData.splits).forEach(([fromId, amount]) => {
            this.debtEdgeService.updateDebt(updateData.apartmentId, fromId, updateData.paidById, amount);
        });
        return expense;
    }

    async updateExpense(expenseId: string, updateData: DeepPartial<Expense>) {
        const expense = await this.expenseRepo.findOne({ where: { expenseId } });
        if (!expense) {
            throw new Error('Expense not found');
        }
        await this.expenseRepo.update(expenseId, updateData);
        const oldSplits = expense.splits;
        const newSplits = updateData.splits;
        const allUserIds = new Set([...Object.keys(oldSplits), ...Object.keys(newSplits)]);
        allUserIds.forEach((userId) => {
            const oldAmount = oldSplits[userId] || 0;
            const newAmount = newSplits[userId] || 0;
            const diff = newAmount - oldAmount;
            if (diff !== 0) {
                this.debtEdgeService.updateDebt(updateData.apartmentId, userId, userId, diff);
            }
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
            .orderBy('expense.createdAt', 'DESC')
            .setParameters({ userId })
            .getRawMany();
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
                userId: expenseWithRelations.paidByUser.userId
            },
        };

        return result;
    }


}
