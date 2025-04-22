
// src/entities/shopping-template.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ShoppingTemplate {
    @PrimaryGeneratedColumn('uuid')
    tid: string;

    @Column()
    aid: string;

    @Column('json')
    items: any[];

    @Column()
    name: string;
}
