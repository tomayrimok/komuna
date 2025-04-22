// src/entities/user-apartment.entity.ts
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Apartment } from '../apartment/apartment.entity';
import { User } from '../user/user.entity';

@Entity()
export class UserApartment {
    @PrimaryColumn()
    aid: string;

    @PrimaryColumn()
    uid: string;

    @Column('float')
    rent: number;

    @Column()
    role: 'manager' | 'member'; //todo enum

    @ManyToOne(() => Apartment, a => a.residents)
    @JoinColumn({ name: 'aid' })
    apartment: Apartment;

    @ManyToOne(() => User, u => u.apartments)
    @JoinColumn({ name: 'uid' })
    user: User;

    @ManyToOne(() => User, u => u.payableRents, { nullable: true })
    @JoinColumn({ name: 'payableBy' })
    payableByUser: User;

}