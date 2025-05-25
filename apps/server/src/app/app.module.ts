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
import { Incident, Comment } from '../incident/incident.entity';
import { Payment } from '../payment/payment.entity';
import { ShoppingList } from '../shopping-list/shopping-list.entity';
import { ShoppingTemplate } from '../shopping-template/shopping-template.entity';
import { Task } from '../task/task.entity';
import { AuthUser } from '../user/auth-user.entity';
import { TaskModule } from '../task/task.module';
import { IncidentModule } from '../incident/incident.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      url: 'postgresql://neondb_owner:npg_hJYINkQqH4A9@ep-floral-mud-a2hotfz9-pooler.eu-central-1.aws.neon.tech/komuna?sslmode=require',
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
        Comment,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
