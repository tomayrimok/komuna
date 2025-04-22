
// src/entities/shopping-list.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ShoppingList {
    @PrimaryGeneratedColumn('uuid')
    sid: string;

    @Column()
    contextType: 'house' | 'user'; //todo enum

    @Column()
    contextId: string;

    @Column('json')
    items: {
        id: string;
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
