import type { RecurrenceRuleDto } from '../recurrence-rule.dto';

export class CreateTaskReqDto {
  title: string;

  description?: string;

  assignedTo: string[];

  isRecurrent: boolean;

  recurrenceRule?: RecurrenceRuleDto;
}

export class EditTaskReqResDto {
  taskId: string;

  title: string;

  description: string;

  assignedTo: string[];

  completions: UserCompletionStatus[];

  dueDate?: Date;

  dueTime?: string;

  isRecurrent: boolean;

  recurrenceRule?: RecurrenceRuleDto;
}

export interface UserCompletionStatus {
  userId: string;

  status: boolean;
}
