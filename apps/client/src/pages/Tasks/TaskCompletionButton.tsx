import { Button, Icon } from "@chakra-ui/react";
import { IconCheck, IconReload } from "@tabler/icons-react";
import { TaskResponseDto } from "libs/types/src/generated";
import { useAuth } from "../../context/auth/AuthProvider";
import { useMemo } from "react";
import { TaskType } from "@komuna/types";
import { useUpdateTaskCompletion } from "../../hooks/useUpdateTaskCompletion";

interface TaskCompletionButtonProps {
    task: TaskResponseDto;
}
const TaskCompletionButton: React.FC<TaskCompletionButtonProps> = ({ task }) => {

    const { mutate: updateTaskCompletion } = useUpdateTaskCompletion();
    const { currentUserDetails } = useAuth();

    const displayStatusButton = useMemo(() => {
        const assignedToCurrentUser = task.assignedTo?.some(user => user.userId === currentUserDetails?.userId);
        const isGroupTask = task.taskType === TaskType.GROUP;
        return (assignedToCurrentUser || isGroupTask || (task.assignedTo?.length === 0));
    }, [task]);

    const showDoneButton = ((!task.completions?.some(completion => completion === currentUserDetails?.userId)) || (task.completions?.length === 0 && task.assignedTo?.length === 0))

    const handleClickDone = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        updateTaskCompletion({ taskId: task.taskId, isCompleted: true });
    };

    const handleClickNotDone = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        updateTaskCompletion({ taskId: task.taskId, isCompleted: false });
    };

    if (!displayStatusButton) return null;
    if (showDoneButton) return (
        <Button
            onClick={handleClickDone}
            size={'sm'}
            variant="subtle"
            colorPalette="green"
        >
            <Icon>
                <IconCheck />
            </Icon>
            סימון כבוצע
        </Button>
    )
    return (
        <Button
            size={'sm'}
            variant="subtle"
            colorPalette="gray"
            onClick={handleClickNotDone}
        >
            <Icon>
                <IconReload />
            </Icon>
            סימון כלא בוצע
        </Button>
    );
}

export default TaskCompletionButton;