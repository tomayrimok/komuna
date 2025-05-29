import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtEdgeModule } from '../debt-edge/debt-edge.module';
import { UserModule } from '../user/user.module';
import { ExpenseModule } from '../expense/expense.module';
import { PaymentModule } from '../payment/payment.module';
import { ApartmentModule } from '../apartment/apartment.module';
import { UserApartmentModule } from '../user-apartment/user-apartment.module';
import { User } from '../user/user.entity';
import { UserApartment } from '../user-apartment/user-apartment.entity';
import { Apartment } from '../apartment/apartment.entity';
import { DebtEdge } from '../debt-edge/debt-edge.entity';
import { Expense } from '../expense/expense.entity';
import { ExpenseSplit } from '../expense-split/expense-split.entity';
import { Incident } from '../incident/incident.entity';
import { Payment } from '../payment/payment.entity';
import { ShoppingList } from '../shopping-list/shopping-list.entity';
import { ShoppingTemplate } from '../shopping-template/shopping-template.entity';
import { Task } from '../task/task.entity';
import { AuthUser } from '../user/auth-user.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { NotificationToken } from '../notifications/notification-token.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      url: process.env.DATABASE_URL,
      type: 'postgres',
      entities: [
        User,
        AuthUser,
        UserApartment,
        Apartment,
        DebtEdge,
        Expense,
        ExpenseSplit,
        Incident,
        Payment,
        ShoppingList,
        ShoppingTemplate,
        Task,
        NotificationToken
      ],
      synchronize: true,
    }),
    DebtEdgeModule,
    UserModule,
    ExpenseModule,
    PaymentModule,
    ApartmentModule,
    UserApartmentModule,
    NotificationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
