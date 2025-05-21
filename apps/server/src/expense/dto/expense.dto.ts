import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsNotEmpty, IsObject, IsPositive } from 'class-validator';

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
  })
  @IsObject()
  splits: { [userId: string]: number };
}
