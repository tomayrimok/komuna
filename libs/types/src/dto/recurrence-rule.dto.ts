import { Frequency, WeekDay } from '../enums';

export class RecurrenceRule {
  frequency: Frequency;

  interval?: number;

  byWeekDay?: WeekDay[];

  until?: string;

  count?: number;
}
