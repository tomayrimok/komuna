import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DebtEdge } from './debt-edge.entity';

@Injectable()
export class DebtEdgeService {
  constructor(
    @InjectRepository(DebtEdge)
    private debtRepo: Repository<DebtEdge>
  ) {}

  // This method updates the debt between two users in an apartment.
  // It first checks if there is a direct debt edge between the two users.
  // If there is, it updates the amount. If not, it creates a new debt edge.
  // It also checks if there is a reverse debt edge (i.e., the other user owes the first user).
  // If there is, it updates the amount accordingly.
  // If the reverse edge amount is greater than the direct edge amount, it reduces the reverse edge amount.
  // If the reverse edge amount is less than the direct edge amount, it creates a new direct edge with the difference.
  // If the reverse edge amount is equal to the direct edge amount, it removes the reverse edge.
  // Finally, it calls the simplifyDebts method to simplify the debts in the apartment.
  async updateDebt(apartmentId: string, fromId: string, toId: string, delta: number) {
    if (fromId === toId || delta === 0) return;

    const roundedDelta = Math.round(delta * 100) / 100;

    const direct = await this.debtRepo.findOneBy({ apartmentId, fromId, toId });
    const reverse = await this.debtRepo.findOneBy({ apartmentId, fromId: toId, toId: fromId });

    if (reverse) {
      if (reverse.amount > roundedDelta) {
        reverse.amount -= roundedDelta;
        await this.debtRepo.save(reverse);
      } else if (reverse.amount < roundedDelta) {
        await this.debtRepo.remove(reverse);
        const newEdge = this.debtRepo.create({
          apartmentId,
          fromId,
          toId,
          amount: roundedDelta - reverse.amount,
        });
        await this.debtRepo.save(newEdge);
      } else {
        await this.debtRepo.remove(reverse);
      }
    } else if (direct) {
      direct.amount += roundedDelta;
      await this.debtRepo.save(direct);
    } else {
      const newEdge = this.debtRepo.create({ apartmentId, fromId, toId, amount: roundedDelta });
      await this.debtRepo.save(newEdge);
    }

    await this.simplifyDebts(apartmentId);
  }

  // This method simplifies the debts in an apartment by consolidating the debts between users.
  // It first retrieves all the debts in the apartment and creates a balance map for each user.
  // It then separates the users into creditors and debtors based on their balances.
  // Finally, it creates new debt edges between the creditors and debtors to simplify the debts.
  // It deletes the old debt edges and saves the new ones.
  // This is done to reduce the number of transactions and make it easier to manage the debts.
  async simplifyDebts(apartmentId: string) {
    const edges = await this.debtRepo.findBy({ apartmentId });
    const balanceMap = new Map<string, number>();

    for (const edge of edges) {
      balanceMap.set(edge.fromId, (balanceMap.get(edge.fromId) || 0) - edge.amount);
      balanceMap.set(edge.toId, (balanceMap.get(edge.toId) || 0) + edge.amount);
    }

    const creditors: { userId: string; amount: number }[] = [];
    const debtors: { userId: string; amount: number }[] = [];

    for (const [userId, balance] of balanceMap.entries()) {
      if (balance > 0) {
        creditors.push({ userId, amount: balance });
      } else if (balance < 0) {
        debtors.push({ userId, amount: -balance });
      }
    }

    await this.debtRepo.delete({ apartmentId });

    let i = 0,
      j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);

      const newEdge = this.debtRepo.create({
        apartmentId,
        fromId: debtor.userId,
        toId: creditor.userId,
        amount,
      });
      await this.debtRepo.save(newEdge);

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount === 0) i++;
      if (creditor.amount === 0) j++;
    }
  }

  async getUserBalance(apartmentId: string, userId: string) {
    const result = await this.debtRepo
      .createQueryBuilder('debt')
      .select('SUM(CASE WHEN debt.fromId = :userId THEN -debt.amount ELSE debt.amount END)', 'balance')
      .where('debt.apartmentId = :apartmentId')
      .andWhere('(debt.fromId = :userId OR debt.toId = :userId)')
      .setParameters({ userId, apartmentId })
      .getRawOne();

    return result?.balance ?? 0;
  }

  async getUserBalanceDetails(apartmentId: string, userId: string) {
    const debts = await this.debtRepo.find({
      where: [
        { apartmentId, fromId: userId },
        { apartmentId, toId: userId },
      ],
      relations: ['fromUser', 'toUser'],
      order: { updatedAt: 'DESC' },
    });

    return debts.map((debt) => ({
      ...debt,
      debtor: debt.fromId === userId,
    }));
  }

  async getDebtDetails(debtId: string) {
    const debt = await this.debtRepo.findOne({
      where: { debtId },
      relations: ['fromUser', 'toUser'],
    });

    if (!debt) return null;

    return debt;
  }
}
