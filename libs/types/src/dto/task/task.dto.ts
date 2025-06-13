import { RecurrenceRuleDto, User } from "../../generated";

export class CreateTaskReqDto {
  title: string;

  description?: string;

  assignedTo: User[];

  isRecurrent: boolean;

  recurrenceRule?: RecurrenceRuleDto;
}
