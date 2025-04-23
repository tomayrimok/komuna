
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ShoppingTemplate {
    @PrimaryGeneratedColumn('uuid')
    shoppingTemplateId: string;

    @Column()
    apartmentId: string;

    @Column('json')
    items: any[];

    @Column()
    name: string;
}
