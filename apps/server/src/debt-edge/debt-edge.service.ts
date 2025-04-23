import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DebtEdge } from './debt-edge.entity';

@Injectable()
export class DebtEdgeService {

    constructor(
        @InjectRepository(DebtEdge)
        private readonly debtRepo: Repository<DebtEdge>,
    ) { }

    async createDebt(apartmentId: string, fromId: string, toId: string, amount: number) {
        const existingDebt = await this.debtRepo.findOneBy({ apartmentId, fromId, toId });
        if (existingDebt) {
            existingDebt.amount += amount;
            await this.debtRepo.save(existingDebt);
        } else {
            await this.debtRepo.save(this.debtRepo.create({ apartmentId, fromId, toId, amount }));
        }
    }

    async updateDebt(apartmentId: string, fromId: string, toId: string, delta: number) {
        const direct = await this.debtRepo.findOneBy({ apartmentId, fromId, toId });
        const reverse = await this.debtRepo.findOneBy({ apartmentId, fromId: toId, toId: fromId });

        if (reverse) {
            if (reverse.amount > delta) {
                reverse.amount -= delta;
                await this.debtRepo.save(reverse);
            } else if (reverse.amount < delta) {
                await this.debtRepo.remove(reverse);
                await this.debtRepo.save(this.debtRepo.create({ apartmentId, fromId, toId, amount: delta - reverse.amount }));
            } else {
                await this.debtRepo.remove(reverse);
            }
        } else if (direct) {
            direct.amount += delta;
            await this.debtRepo.save(direct);
        } else {
            await this.debtRepo.save(this.debtRepo.create({ apartmentId, fromId, toId, amount: delta }));
        }
    }

}
