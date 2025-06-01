import { Injectable, OnModuleInit } from '@nestjs/common';
import { DebtEdgeService } from '../debt-edge/debt-edge.service';
import { ExpenseService } from '../expense/expense.service';
import { PaymentService } from '../payment/payment.service';
import { UserApartmentService } from '../user-apartment/user-apartment.service';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';
import { ApartmentService } from '../apartment/apartment.service';
import { ContextType, UserRole } from '@komuna/types';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly notificationService: NotificationService,
  ) { }

  onModuleInit() {
    // this.testNotificationService();
  }

  async testNotificationService() {
    setInterval(() => {
      // this.notificationService.sendTest('5c271ba7-6740-4fe2-8d0e-8af4e4a91dd7')
      this.notificationService.addNotification(
        ContextType.APARTMENT,
        '92dc0b55-bf6c-450c-b927-b820dd492e97',
        {
          notification: {
            title: 'Test Notification',
            body: 'This is a test notification',
          },
        },
        [UserRole.ROOMMATE]
      )
    }, 6000);
  }

  async testDebtEdgeService() {

    // const aaa = await this.userService.getUserById('9ebd215a-8101-4a5a-96c3-04016aabcd1b');
    // const bbb = await this.userService.createUser({ firstName: 'bbb', lastName: 'bbb', phoneNumber: '054-7654321' });
    // const ccc = await this.userService.createUser({ firstName: 'ccc', lastName: 'ccc', phoneNumber: '054-24232' });
    // const apartment = await this.apartmentService.createApartment({ name: 'Herzel 14', code: '1111' });
    // create user-apartment relation
    // await this.userApartmentService.createUserApartment({ userId: aaa.userId, apartmentId: apartment.apartmentId, role: UserRole.MEMBER });
    // await this.userApartmentService.createUserApartment({ userId: bbb.userId, apartmentId: apartment.apartmentId, role: UserRole.MEMBER });
    // Now bbb payed for batteries
    // const expense = await this.expenseService.createExpense({ description: 'Batteries', amount: 500, apartmentId: apartment.apartmentId, splits: [{ userId: aaa.userId, amount: 10 }, { userId: aaa.userId, amount: 10 }] }, aaa.userId);
    // const expense = await this.expenseService.createExpense({ description: 'Batteries', amount: 20, apartmentId: '60514c72-5b94-417f-b4a3-9da2092a267f', splits: [{ userId: aaa.userId, amount: 10 }, { userId: bbb.userId, amount: 10 }] }, aaa.userId);
    // await this.debtEdgeService.updateDebt('60514c72-5b94-417f-b4a3-9da2092a267f', aaa.userId, bbb.userId, 60);
    // await this.debtEdgeService.updateDebt('60514c72-5b94-417f-b4a3-9da2092a267f', bbb.userId, ccc.userId, 30);
    // await this.debtEdgeService.updateDebt('60514c72-5b94-417f-b4a3-9da2092a267f', ccc.userId, aaa.userId, 60);
    // await this.debtEdgeService.updateDebt('60514c72-5b94-417f-b4a3-9da2092a267f', ccc.userId, aaa.userId, 30);
    // await this.debtEdgeService.updateDebt('60514c72-5b94-417f-b4a3-9da2092a267f', bbb.userId, aaa.userId, 10);
  }
}
