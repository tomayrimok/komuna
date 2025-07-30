import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { GeneralShoppingList } from './general-shopping-list.entity';
import { GeneralShoppingListService } from './general-shopping-list.service';
import { GeneralShoppingListController } from './general-shopping-list.controller';
import { GeneralShoppingListSchedulerService } from './general-shopping-list-scheduler.service';
import { ShoppingListModule } from '../shopping-list/shopping-list.module';
import { NotificationModule } from '../notification/notification.module';
import { UserApartmentModule } from '../user-apartment/user-apartment.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([GeneralShoppingList]),
        ShoppingListModule,
        NotificationModule,
        UserApartmentModule,
        JwtModule,
    ],
    providers: [GeneralShoppingListService, GeneralShoppingListSchedulerService],
    controllers: [GeneralShoppingListController],
    exports: [GeneralShoppingListService],
})
export class GeneralShoppingListModule { } 