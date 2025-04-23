import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtEdgeModule } from '../debt-edge/debt-edge.module';
import { UserModule } from '../user/user.module';
import { ExpenseModule } from '../expense/expense.module';
import { PaymentModule } from '../payment/payment.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    DebtEdgeModule,
    UserModule,
    ExpenseModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }
