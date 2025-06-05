import { ContextType } from '@komuna/types';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { ShoppingListItemWithIdDto } from './dto/shopping-list-item.dto';

@Entity()
export class ShoppingList {
  @PrimaryColumn({ type: 'enum', enum: ContextType })
  @ApiProperty({ enum: ContextType, enumName: 'ContextType' })
  contextType: ContextType;

  @PrimaryColumn()
  @ApiProperty()
  contextId: string;

  @ApiProperty({ type: () => ShoppingListItemWithIdDto, isArray: true })
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
