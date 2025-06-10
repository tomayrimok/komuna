import { IsEnum, IsInt, IsOptional, IsArray, Min, IsDateString } from 'class-validator';
import { Frequency, WeekDay, type RecurrenceRule } from '@komuna/types';
import { ApiProperty } from '@nestjs/swagger';

export class RecurrenceRuleDto implements RecurrenceRule {
  @ApiProperty()
  @IsEnum(Frequency)
  frequency: Frequency;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  interval?: number; // every $interval $frequency

  @ApiProperty()
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
