import { ShoppingListContextType } from '@komuna/types';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn('uuid')
  shoppingListId: string;

  @Column({ type: 'enum', enum: ShoppingListContextType })
  contextType: ShoppingListContextType;

  @Column()
  contextId: string;

  @Column('json', { default: [] })
  items: {
    itemId: string;
    name: string;
    isPurchased: boolean;
    image: string;
    category: string;
    isUrgent: boolean;
    amount: number;
    creatorId: string;
    assignedTo: string;
  }[]; //todo move to separate entity? assignedTo is a userId

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
