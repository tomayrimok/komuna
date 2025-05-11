import { Injectable, OnModuleInit } from '@nestjs/common';

import { ApartmentService } from '../apartment/apartment.service';
import { DebtEdgeService } from '../debt-edge/debt-edge.service';
import { ExpenseService } from '../expense/expense.service';
import { PaymentService } from '../payment/payment.service';
import { UserApartmentService } from '../user-apartment/user-apartment.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly debtEdgeService: DebtEdgeService,
    private readonly paymentService: PaymentService,
    private readonly expenseService: ExpenseService,
    private readonly userService: UserService,
    private readonly apartmentService: ApartmentService,
    private readonly userApartmentService: UserApartmentService
  ) { }

  onModuleInit() {
  }

}
