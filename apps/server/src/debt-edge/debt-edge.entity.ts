import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class DebtEdge {
  @ApiProperty({ description: 'Unique identifier for the debt' })
  @PrimaryGeneratedColumn('uuid')
  debtId: string;

  @ApiProperty({ description: 'ID of the apartment this debt belongs to' })
  @Column()
  apartmentId: string;

  @ApiProperty({ description: 'ID of the user who owes the debt' })
  @Column()
  fromId: string;

  @ApiProperty({ description: 'ID of the user who is owed the debt' })
  @Column()
  toId: string;

  @ApiProperty({ description: 'Amount of the debt' })
  @Column('float')
  amount: number;

  @ApiProperty({ description: 'Last update date of the debt' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => User, description: 'User who owes the debt' })
  @ManyToOne(() => User, (user) => user.debts)
  @JoinColumn({ name: 'fromId' })
  fromUser: User;

  @ApiProperty({ type: () => User, description: 'User who is owed the debt' })
  @ManyToOne(() => User, (user) => user.credits)
  @JoinColumn({ name: 'toId' })
  toUser: User;
}
