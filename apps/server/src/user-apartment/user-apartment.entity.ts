import { UserRole } from '@komuna/types';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Apartment } from '../apartment/apartment.entity';
import { User } from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * ! This is only used for users that are roommates at the apartment.
 * ! For landlords, use the `landlord` field in the `Apartment` entity which is related to the `User` entity.
 */
@Entity()
export class UserApartment {
  @ApiProperty({ description: 'The ID of the apartment where the user resides' })
  @PrimaryColumn()
  apartmentId: string;

  @ApiProperty({ description: 'The ID of the user who is a resident in the apartment' })
  @PrimaryColumn()
  userId: string;

  @ApiProperty({ description: 'The amount of rent the user pays for the apartment' })
  @Column('float', { nullable: true })
  rent?: number;

  @ApiProperty({ description: 'The role of the user in the apartment', enum: UserRole })
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @ApiProperty({ type: () => Apartment, description: 'The apartment where the user resides' })
  @ManyToOne(() => Apartment, (a) => a.residents)
  @JoinColumn({ name: 'apartmentId' })
  apartment: Apartment;

  @ApiProperty({ type: () => User, description: 'The user who is a resident in the apartment' })
  @ManyToOne(() => User, (u) => u.apartments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ type: () => User, description: 'The user who is responsible for paying rent', nullable: true })
  @ManyToOne(() => User, (u) => u.payableRents, { nullable: true })
  @JoinColumn({ name: 'payableBy' })
  payableByUser: User;

  @ApiProperty({ description: 'The date when the user-apartment relationship was created' })
  @CreateDateColumn()
  createdAt: Date;
}
