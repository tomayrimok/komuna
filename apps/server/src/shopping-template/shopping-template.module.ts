import { Module } from '@nestjs/common';
import { ShoppingTemplateService } from './shopping-template.service';
import { ShoppingTemplateController } from './shopping-template.controller';

@Module({
  providers: [ShoppingTemplateService],
  controllers: [ShoppingTemplateController],
})
export class ShoppingTemplateModule {}
