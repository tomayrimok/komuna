import { TaskType } from "@komuna/types";
import { TaskResponseDto } from "libs/types/src/generated";

export const getTaskCompleted = (task: TaskResponseDto) => {
    if (task.taskType === TaskType.GROUP) return task.completions?.length !== 0;
    return task.completions?.length === task.assignedTo?.length;
}