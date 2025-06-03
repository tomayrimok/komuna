import { UserRole } from '@komuna/types';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Apartment } from '../apartment/apartment.entity';
import { User } from '../user/user.entity';

/**
 * ! This is only used for users that are roommates at the apartment.
 * ! For landlords, use the `landlord` field in the `Apartment` entity which is related to the `User` entity.
 */
@Entity()
export class UserApartment {
  @PrimaryColumn()
  apartmentId: string;

  @PrimaryColumn()
  userId: string;

  /** Renter Settings */
  /** Rent of the current user out of the total rent of the apartment */
  @Column('float', { nullable: true })
  rent?: number;

  /** Apartment Info */
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @ManyToOne(() => Apartment, (a) => a.residents)
  @JoinColumn({ name: 'apartmentId' })
  apartment: Apartment;

  @ManyToOne(() => User, (u) => u.apartments)
  @JoinColumn({ name: 'userId' })
  user: User;

  /** Renter Settings */
  /** The user id of who pays the rent, or NULL if it's paid by current user */
  @ManyToOne(() => User, (u) => u.payableRents, { nullable: true })
  @JoinColumn({ name: 'payableBy' })
  payableByUser: User;

  @CreateDateColumn()
  createdAt: Date;
}
