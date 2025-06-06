import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsBoolean } from 'class-validator';
import { UserCompletionStatus as UserCompletionStatusDto } from '@komuna/types';

export class UserCompletionStatus implements UserCompletionStatusDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsBoolean()
  status: boolean;
}
