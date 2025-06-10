import { RecurrenceRuleDto } from "../../generated";

export class CreateTaskReqDto {
  title: string;

  description?: string;

  assignedTo: string[];

  isRecurrent: boolean;

  recurrenceRule?: RecurrenceRuleDto;
}



export interface UserCompletionStatus {
  userId: string;

  status: boolean;
}
