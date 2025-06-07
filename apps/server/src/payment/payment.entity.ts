import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Payment {
  @ApiProperty({ description: 'Unique identifier for the payment' })
  @PrimaryGeneratedColumn('uuid')
  paymentId: string;

  @ApiProperty({ description: 'ID of the apartment where the payment is made' })
  @Column()
  apartmentId: string;

  @ApiProperty({ description: 'ID of the user making the payment' })
  @Column()
  fromId: string;

  @ApiProperty({ description: 'ID of the user receiving the payment' })
  @Column()
  toId: string;

  @ApiProperty({ description: 'Amount of the payment' })
  @Column('float')
  amount: number;

  @ApiProperty({ description: 'Date when the payment was created' })
  @CreateDateColumn()
  createdAt: Date;
}
