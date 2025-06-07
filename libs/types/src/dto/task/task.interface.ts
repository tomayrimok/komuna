import { RecurrenceRuleDto } from '@komuna/types';

export interface TaskDto {
  apartmentId: string;

  title: string;

  description: string;

  assignedTo: string[];

  isCompleted: boolean;

  dueDate: Date;

  isRecurrent: boolean;

  recurrenceRule?: RecurrenceRuleDto;

  createdBy: string;
}

export class EditTaskReqDto {
    taskId: string;

    dueDate: string;

    title: string;

    description: string;

    isRecurrent: boolean;

    recurrenceRule?: RecurrenceRuleDto;

    assignedTo?: string[];
}

export class UpdateTaskStatusReqDto {
  taskId: string;

  isCompleted?: boolean;
}

export interface UserCompletionStatus {
  userId: string;

  isCompleted: boolean;
}
