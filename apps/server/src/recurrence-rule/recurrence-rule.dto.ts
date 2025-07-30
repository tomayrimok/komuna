import { IsEnum, IsInt, IsOptional, IsArray, Min, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Frequency, RecurrenceRule, WeekDay } from '@komuna/types';

export class RecurrenceRuleDto {
  @ApiProperty({ enum: Frequency, enumName: 'Frequency' })
  @IsEnum(Frequency)
  frequency: Frequency;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  interval?: number; // every $interval $frequency

  @ApiProperty({ type: [WeekDay], enum: WeekDay, enumName: 'WeekDay', required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(WeekDay, { each: true })
  byWeekDay?: WeekDay[]; // e.g. [WeekDay.MO, WeekDay.FR]

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  until?: string; // ISO date string. If null, is indefinite.

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  count?: number; // number of occurrences, instead of until.
}
