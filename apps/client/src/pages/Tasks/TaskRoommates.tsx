import { Avatar, Flex } from "@chakra-ui/react";
import { TaskResponseDto } from "libs/types/src/generated";
import { Tooltip } from "../../chakra/ui/tooltip";
import { TaskType } from "@komuna/types";
import { useMemo } from "react";
import { toLocalDateString } from "../../utils/dateUtils";

interface TaskRoommatesProps {
    task: TaskResponseDto;
}
const TaskRoommates: React.FC<TaskRoommatesProps> = ({ task }) => {

    const overdue = useMemo(() => {
        if (!task.dueDate) return false;
        return toLocalDateString(new Date(task.dueDate)) < toLocalDateString(new Date());
    }, [task.dueDate]);

    return (
        <Flex>
            {task.assignedTo?.map((user, i) => {
                const isCompleted = task.completions?.includes(user.userId);
                const isOverdue = overdue && task.taskType === TaskType.PERSONAL && !isCompleted;
                const borderColor = task.taskType === TaskType.PERSONAL ? (isCompleted ? 'green.600' : isOverdue ? 'red.600' : 'gray.200') : 'white';
                return (
                    <Avatar.Root
                        ms={i ? -3 : 0}
                        size="sm"
                        shape="full"
                        zIndex={task.assignedTo!.length - i}
                        border={task.taskType === TaskType.PERSONAL ? "1px solid white" : '3px solid white'}
                        key={user.userId}
                        borderColor={borderColor}
                        shadow={task.taskType === TaskType.PERSONAL ? "sm" : 'none'}
                    >
                        <Tooltip content={`${user.firstName} ${user.lastName}`} key={user.userId}>
                            <Avatar.Image src={user.image} alt={user.firstName} />
                        </Tooltip>
                        <Avatar.Fallback name={`${user.firstName} ${user.lastName}`} />
                    </Avatar.Root>
                )
            })}
        </Flex>
    )
}

export default TaskRoommates;