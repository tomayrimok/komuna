import { Injectable, OnModuleInit } from '@nestjs/common';
import { DebtEdgeService } from '../debt-edge/debt-edge.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AppService implements OnModuleInit {

  constructor(
    private readonly debtEdgeService: DebtEdgeService,
    private readonly paymentService: DebtEdgeService,
    private readonly expenseService: DebtEdgeService,
    private readonly userService: UserService,
  ) {

  }

  onModuleInit() {
    console.log("AppService initialized");
  }

  testDebtEdgeService() {
    // create user
    const user1 = this.userService.createUser({ name: 'User 1' });

  }

}
