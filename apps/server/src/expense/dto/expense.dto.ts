import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsNotEmpty, IsObject, IsPositive } from 'class-validator';
import { User } from '../../user/user.entity';
import { SplitType } from '@komuna/types';

export class AddEditExpenseDto {
  @ApiProperty({ description: 'ID of the expense (optional for new expenses)', required: false })
  @IsOptional()
  @IsString()
  expenseId?: string;

  @ApiProperty({ description: 'Amount of the expense', minimum: 0 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ description: 'Description of the expense' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'ID of the user who paid for the expense' })
  @IsString()
  @IsNotEmpty()
  paidById: string;

  @ApiProperty({ description: 'ID of the apartment this expense belongs to' })
  @IsString()
  @IsNotEmpty()
  apartmentId: string;

  @ApiProperty({
    description: 'Object containing user IDs as keys and their share amounts as values',
    example: { user1: 50, user2: 50 },
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  @IsObject()
  splits: { [userId: string]: number };

  @ApiProperty({
    description: 'Type of split for the expense',
    enum: SplitType,
    enumName: 'SplitType',
  })
  @IsString()
  @IsNotEmpty()
  splitType: SplitType;
}

export class ApartmentExpensesResponse {
  @ApiProperty({ description: 'ID of the apartment this expense belongs to' })
  @IsString()
  apartmentId: string;

  @ApiProperty({ description: 'Amount of the expense' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Creation date of the expense' })
  @IsString()
  createdAt: string;

  @ApiProperty({ description: 'Description of the expense' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'ID of the expense' })
  @IsString()
  expenseId: string;

  @ApiProperty({ description: 'ID of the user who paid for the expense' })
  @IsString()
  paidById: string;

  @ApiProperty({ type: User, description: 'User who paid for the expense' })
  paidByUser: User;

  @ApiProperty({
    description: 'Object containing user IDs as keys and their share amounts as values',
    example: { user1: 50, user2: 50 },
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  splits: { [userId: string]: number };

  @ApiProperty({ description: 'Whether the expense was paid by the current user', required: false })
  paidByMe?: boolean;

  @ApiProperty({ description: 'Amount the current user needs to pay for this expense', required: false })
  splitAmount?: string;
}
