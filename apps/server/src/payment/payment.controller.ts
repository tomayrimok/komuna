import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
    ) { }

    @Post('create-payment')
    async createPayment(@Body('apartmentId') apartmentId: string, @Body('fromId') fromId: string, @Body('toId') toId: string, @Body('amount') amount: number) {
        return this.paymentService.createPayment(apartmentId, fromId, toId, amount);
    }
}
