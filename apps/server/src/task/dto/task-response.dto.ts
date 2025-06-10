import { ApiProperty } from "@nestjs/swagger";
import { UpdateTaskDto } from "./task.dto";

export class TaskResDto extends UpdateTaskDto {
  @ApiProperty()
  apartmentId: string;
}
