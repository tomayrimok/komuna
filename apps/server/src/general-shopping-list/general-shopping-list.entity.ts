import { ContextType } from '@komuna/types';
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RecurrenceRuleDto } from '../recurrence-rule/recurrence-rule.dto';
import { User } from '../user/user.entity';

export interface ShoppingListTemplateItem {
    itemId?: string;
    name: string;
    category?: string;
    amount: number;
    isUrgent?: boolean;
    image?: string;
}

@Entity()
export class GeneralShoppingList {
    @PrimaryGeneratedColumn('uuid')
    generalShoppingListId: string;

    @Column()
    apartmentId: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ type: 'enum', enum: ContextType, default: ContextType.APARTMENT })
    targetContextType: ContextType; // Whether generated lists should be personal or apartment-wide

    @Column('json')
    items: ShoppingListTemplateItem[];

    @Column('json', { nullable: true })
    recurrenceRule?: RecurrenceRuleDto; // Null if manual-only template

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'boolean', default: false })
    isManualOnly: boolean; // If true, only creates on manual request, not automatically

    @Column({ type: 'timestamp', nullable: true })
    lastGeneratedAt?: Date;

    @Column({ type: 'timestamp', nullable: true })
    nextGenerationAt?: Date; // Null if manual-only

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
} 