import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsBoolean } from 'class-validator';

export class UserCompletionStatus {
    @ApiProperty({})
    @IsUUID()
    userId: string;
  
    @ApiProperty({})
    @IsBoolean()
    isCompleted: boolean;
  }
  