import { Injectable, OnModuleInit } from '@nestjs/common';
import { DebtEdgeService } from '../debt-edge/debt-edge.service';
import { ExpenseService } from '../expense/expense.service';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly debtEdgeService: DebtEdgeService,
    private readonly paymentService: PaymentService,
    private readonly expenseService: ExpenseService // private readonly apartmentService: ApartmentService,
  ) // private readonly userApartmentService: UserApartmentService
  {}

  onModuleInit() {
    // console.log('AppService initialized');
  }
}
