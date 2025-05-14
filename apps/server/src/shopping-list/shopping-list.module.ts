import { Module } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingList } from './shopping-list.entity';
import { ShoppingTemplate } from '../shopping-template/shopping-template.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [ShoppingListService],
  controllers: [ShoppingListController],
  exports: [ShoppingListService],
  imports: [
    TypeOrmModule.forFeature([ShoppingList, ShoppingTemplate]),
    JwtModule
  ],
})
export class ShoppingListModule { }
