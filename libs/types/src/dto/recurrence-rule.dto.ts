import { IsEnum, IsInt, IsOptional, IsArray, Min, IsDateString } from 'class-validator';
import { Frequency, WeekDay } from '../enums';

export class RecurrenceRuleDto {
  @IsEnum(Frequency)
  frequency: Frequency;

  @IsOptional()
  @IsInt()
  @Min(1)
  interval?: number; // every $interval $frequency

  @IsOptional()
  @IsArray()
  @IsEnum(WeekDay, { each: true })
  byWeekDay?: WeekDay[]; // e.g. [WeekDay.MO, WeekDay.FR]

  @IsOptional()
  @IsDateString()
  until?: string; // ISO date string. If null, is indefinite.

  @IsOptional()
  @IsInt()
  @Min(1)
  count?: number; // number of occurrences, instead of until.
}
