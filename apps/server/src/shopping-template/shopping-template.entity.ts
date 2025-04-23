
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ShoppingTemplate {
    @PrimaryGeneratedColumn('uuid')
    shoppingTemplateId: string;

    @Column()
    apartmentId: string;

    @Column('json')
    items: { name: string; category: string; amount: number; }[]; //todo move to separate entity?

    @Column()
    name: string;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
