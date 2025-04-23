import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Apartment } from '../apartment/apartment.entity';
import { User } from '../user/user.entity';
import { UserRole } from '../types/enums/UserRole.enum';

@Entity()
export class UserApartment {
    @PrimaryColumn()
    apartmentId: string;

    @PrimaryColumn()
    userId: string;

    @Column('float', { nullable: true })
    rent?: number;

    @Column({ type: 'enum', enum: UserRole })
    role: UserRole;

    @ManyToOne(() => Apartment, a => a.residents)
    @JoinColumn({ name: 'apartmentId' })
    apartment: Apartment;

    @ManyToOne(() => User, u => u.apartments)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => User, u => u.payableRents, { nullable: true })
    @JoinColumn({ name: 'payableBy' })
    payableByUser: User;

    @CreateDateColumn()
    createdAt: Date;

}