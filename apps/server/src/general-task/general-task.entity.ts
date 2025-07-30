import { TaskType } from '@komuna/types';
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RecurrenceRuleDto } from '../recurrence-rule/recurrence-rule.dto';
import { User } from '../user/user.entity';

@Entity()
export class GeneralTask {
    @PrimaryGeneratedColumn('uuid')
    generalTaskId: string;

    @Column()
    apartmentId: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ type: 'enum', enum: TaskType, default: TaskType.GROUP })
    taskType?: TaskType;

    @Column('time', { nullable: true })
    defaultDueTime?: string;

    @Column('json')
    recurrenceRule: RecurrenceRuleDto;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lastGeneratedAt?: Date;

    @Column({ type: 'timestamp', nullable: true })
    nextGenerationAt?: Date;

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.userId, { eager: true })
    @JoinColumn({ name: 'createdByUserId' })
    createdBy: User;

    @Column({ type: 'uuid' })
    createdByUserId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => User, { eager: true })
    @JoinTable()
    defaultAssignedTo: User[];
} 