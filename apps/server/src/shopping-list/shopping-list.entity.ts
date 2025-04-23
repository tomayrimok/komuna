import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ContextType } from '../types/enums/ContextType.enum';

@Entity()
export class ShoppingList {
    @PrimaryGeneratedColumn('uuid')
    shoppingListId: string;

    @Column({ type: 'enum', enum: ContextType })
    contextType: ContextType;

    @Column()
    contextId: string;

    @Column('json')
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
    }[];
}
