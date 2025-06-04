import { Body, Controller, MethodNotAllowedException, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/payments.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { Payment } from './payment.entity';

@Controller('payment')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
    ) { }

    @Post('create-payment')
    @ApiOkResponse({ type: Payment })
    async createPayment(@Body() body: CreatePaymentDto) {
        const { apartmentId, fromId, toId, amount } = body;
        return this.paymentService.createPayment(apartmentId, fromId, toId, amount);
    }
}
