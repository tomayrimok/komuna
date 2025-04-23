import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DebtEdge } from './debt-edge.entity';

@Injectable()
export class DebtEdgeService {
    constructor(
        @InjectRepository(DebtEdge)
        private debtRepo: Repository<DebtEdge>,
    ) { }

    async updateDebt(apartmentId: string, fromId: string, toId: string, delta: number) {
        if (fromId === toId || delta === 0) return;

        const direct = await this.debtRepo.findOneBy({ apartmentId, fromId, toId });
        const reverse = await this.debtRepo.findOneBy({ apartmentId, fromId: toId, toId: fromId });

        if (reverse) {
            if (reverse.amount > delta) {
                reverse.amount -= delta;
                await this.debtRepo.save(reverse);
            } else if (reverse.amount < delta) {
                await this.debtRepo.remove(reverse);
                const newEdge = this.debtRepo.create({
                    apartmentId,
                    fromId,
                    toId,
                    amount: delta - reverse.amount,
                });
                await this.debtRepo.save(newEdge);
            } else {
                await this.debtRepo.remove(reverse);
            }
        } else if (direct) {
            direct.amount += delta;
            await this.debtRepo.save(direct);
        } else {
            const newEdge = this.debtRepo.create({ apartmentId, fromId, toId, amount: delta });
            await this.debtRepo.save(newEdge);
        }

        await this.simplifyDebts(apartmentId);
    }

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

        let i = 0, j = 0;
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
}

