import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from '../apartment/apartment.entity';
import { ApartmentModule } from '../apartment/apartment.module';
import { DebtEdge } from '../debt-edge/debt-edge.entity';
import { DebtEdgeModule } from '../debt-edge/debt-edge.module';
import { ExpenseSplit } from '../expense-split/expense-split.entity';
import { Expense } from '../expense/expense.entity';
import { ExpenseModule } from '../expense/expense.module';
import { Incident } from '../incident/incident.entity';
import { NotificationToken } from '../notification/notification-token.entity';
import { Notification } from '../notification/notification.entity';
import { NotificationModule } from '../notification/notification.module';
import { Payment } from '../payment/payment.entity';
import { PaymentModule } from '../payment/payment.module';
import { ShoppingList } from '../shopping-list/shopping-list.entity';
import { ShoppingTemplate } from '../shopping-template/shopping-template.entity';
import { Task } from '../task/task.entity';
import { UserApartment } from '../user-apartment/user-apartment.entity';
import { UserApartmentModule } from '../user-apartment/user-apartment.module';
import { AuthUser } from '../user/auth-user.entity';
import { ShoppingListModule } from '../shopping-list/shopping-list.module';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      url: process.env.DATABASE_URL,
      type: 'postgres',
      // logging: true,
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
        NotificationToken,
        Notification,
      ],
      synchronize: true,
    }),
    DebtEdgeModule,
    UserModule,
    ExpenseModule,
    PaymentModule,
    ApartmentModule,
    UserApartmentModule,
    ShoppingListModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
