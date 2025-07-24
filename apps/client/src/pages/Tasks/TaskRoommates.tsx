import { Avatar, Flex } from "@chakra-ui/react";
import { TaskResponseDto } from "libs/types/src/generated";
import { Tooltip } from "../../chakra/ui/tooltip";

interface TaskRoommatesProps {
    task: TaskResponseDto;
}
const TaskRoommates: React.FC<TaskRoommatesProps> = ({ task }) => {
    return (
        <Flex>
            {task.assignedTo?.map((user, i) => (
                <Avatar.Root ms={i ? -3 : 0} size="sm" shape="full" zIndex={task.assignedTo!.length - i} border="3px solid white" key={user.userId}>
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