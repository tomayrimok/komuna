import { ApiProperty } from "@nestjs/swagger";
import { EditTaskDto } from "./task.dto";

export class TaskResDto extends EditTaskDto {
  @ApiProperty()
  apartmentId: string;
}
