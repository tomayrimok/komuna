import { Avatar, Flex } from "@chakra-ui/react";
import { TaskResponseDto } from "libs/types/src/generated";
import { Tooltip } from "../../chakra/ui/tooltip";
import { TaskType } from "@komuna/types";

interface TaskRoommatesProps {
    task: TaskResponseDto;
}
const TaskRoommates: React.FC<TaskRoommatesProps> = ({ task }) => {
    return (
        <Flex>
            {task.assignedTo?.map((user, i) => (
                <Avatar.Root
                    ms={i ? -3 : 0}
                    size="sm"
                    shape="full"
                    zIndex={task.assignedTo!.length - i}
                    border={task.taskType === TaskType.PERSONAL ? "1px solid white" : '3px solid white'}
                    key={user.userId}
                    borderColor={task.taskType === TaskType.PERSONAL ? (task.completions?.includes(user.userId) ? 'green.600' : 'red.600') : 'white'}
                    shadow={task.taskType === TaskType.PERSONAL ? "sm" : 'none'}
                >
                    <Tooltip content={`${user.firstName} ${user.lastName}`} key={user.userId}>
                        <Avatar.Image src={user.image} alt={user.firstName} />
                    </Tooltip>
                    <Avatar.Fallback name={`${user.firstName} ${user.lastName}`} />
                </Avatar.Root>
            ))}
        </Flex>
    )
}

export default TaskRoommates;