import { ShoppingListContextType } from '@komuna/types';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ShoppingListItemDto } from './dto/shopping-list-item.dto';

@Entity()
export class ShoppingList {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  shoppingListId: string;

  @ApiProperty({ enum: ShoppingListContextType, enumName: 'ShoppingListContextType' })
  @Column({ type: 'enum', enum: ShoppingListContextType })
  contextType: ShoppingListContextType;

  @ApiProperty()
  @Column()
  contextId: string;

  @ApiProperty({ type: () => ShoppingListItemDto, isArray: true })
  @Column('json', { default: [] })
  items: {
    itemId: string;
    name: string;
    isPurchased: boolean;
    image?: string;
    category?: string;
    isUrgent: boolean;
    amount: number;
    creatorId: string;
    assignedTo?: string;
    createdAt: string;
  }[]; //todo move to separate entity? assignedTo is a userId

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
