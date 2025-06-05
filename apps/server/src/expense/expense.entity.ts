import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SplitType } from '@komuna/types';

@Entity()
export class Expense {
  @ApiProperty({ description: 'Unique identifier for the expense' })
  @PrimaryGeneratedColumn('uuid')
  expenseId: string;

  @ApiProperty({ description: 'ID of the apartment associated with the expense' })
  @Column()
  apartmentId: string;

  @ApiProperty({ description: 'Description of the expense' })
  @Column()
  description: string;

  @ApiProperty({ description: 'Amount of the expense' })
  @Column('float')
  amount: number;

  @ApiProperty({ description: 'ID of the user who paid for the expense' })
  @Column({ nullable: true })
  paidById: string;

  @ApiProperty({
    description: 'Splits of the expense among users',
    example: { user1: 50, user2: 50 },
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  @Column('json', { nullable: true })
  splits: { [userId: string]: number };

  @ApiProperty({ description: 'Type of split for the expense', enum: SplitType, enumName: 'SplitType' })
  @Column({ type: 'enum', enum: SplitType })
  splitType: SplitType;

  @ApiProperty({ type: () => User, description: 'User who paid for the expense' })
  @ManyToOne(() => User, (user) => user.expenses)
  @JoinColumn({ name: 'paidById' })
  paidByUser: User;

  @ApiProperty({ description: 'Creation date of the expense' })
  @CreateDateColumn()
  createdAt: Date;
}
