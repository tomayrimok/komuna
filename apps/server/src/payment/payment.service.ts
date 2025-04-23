import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Repository } from 'typeorm';
import { DebtEdgeService } from '../debt-edge/debt-edge.service';

@Injectable()
export class PaymentService {

    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepo: Repository<Payment>,
        private readonly debtEdgeService: DebtEdgeService,
    ) { }

    async addPayment(apartmentId: string, fromId: string, toId: string, amount: number) {
        const payment = this.paymentRepo.create({ apartmentId, fromId, toId, amount });
        await this.paymentRepo.save(payment);

        await this.debtEdgeService.updateDebt(apartmentId, fromId, toId, -amount);
    }

}
