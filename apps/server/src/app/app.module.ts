import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from '../apartment/apartment.entity';
import { ApartmentModule } from '../apartment/apartment.module';
import { DebtEdge } from '../debt-edge/debt-edge.entity';
import { DebtEdgeModule } from '../debt-edge/debt-edge.module';
import { ExpenseSplit } from '../expense-split/expense-split.entity';
import { Expense } from '../expense/expense.entity';
import { ExpenseModule } from '../expense/expense.module';
import { Comment, Incident } from '../incident/incident.entity';
import { IncidentModule } from '../incident/incident.module';
import { NotificationToken } from '../notification/notification-token.entity';
import { Notification } from '../notification/notification.entity';
import { NotificationModule } from '../notification/notification.module';
import { Payment } from '../payment/payment.entity';
import { PaymentModule } from '../payment/payment.module';
import { ShoppingList } from '../shopping-list/shopping-list.entity';
import { ShoppingTemplate } from '../shopping-template/shopping-template.entity';
import { Task } from '../task/task.entity';
import { TaskModule } from '../task/task.module';
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
      // url: 'postgresql://neondb_owner:npg_hJYINkQqH4A9@ep-floral-mud-a2hotfz9-pooler.eu-central-1.aws.neon.tech/komuna?sslmode=require',
      type: 'postgres',
      url: process.env.DATABASE_URL,
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
        Comment,
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
    TaskModule,
    IncidentModule,
    ShoppingListModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
