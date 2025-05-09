import { Entity, Column, CreateDateColumn, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AuthUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn({ unique: true })
  phoneNumber: string;

  @Column({ nullable: true })
  verificationCode?: string;

  @Column({ type: 'timestamp', nullable: true })
  verificationCodeExpiresAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isVerified: boolean;
}
