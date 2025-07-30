import { Button, Icon } from "@chakra-ui/react";
import { IconCheck, IconReload } from "@tabler/icons-react";
import { TaskResponseDto } from "libs/types/src/generated";
import { useAuth } from "../../context/auth/AuthProvider";
import { useMemo } from "react";
import { TaskType } from "@komuna/types";
import { useUpdateTaskCompletion } from "../../hooks/useUpdateTaskCompletion";
import { useTranslation } from "react-i18next";

interface TaskCompletionButtonProps {
    task: TaskResponseDto;
}
const TaskCompletionButton: React.FC<TaskCompletionButtonProps> = ({ task }) => {

    const { mutate: updateTaskCompletion } = useUpdateTaskCompletion();
    const { currentUserDetails } = useAuth();
    const { t } = useTranslation();
    const displayStatusButton = useMemo(() => {
        const assignedToCurrentUser = task.assignedTo?.some(user => user.userId === currentUserDetails?.userId);
        const isGroupTask = task.taskType === TaskType.GROUP;
        return (assignedToCurrentUser || isGroupTask || (task.assignedTo?.length === 0));
    }, [task]);

    const taskIsNotCompleted = (
        (task.completions?.length === 0 && task.taskType === TaskType.GROUP) // if the task is not assigned to anyone and not completed by anyone and its a group task
        || (task.completions?.length === 0 && task.assignedTo?.length === 0) // if the task is not assigned to anyone and not completed by anyone
        || (!task.completions?.some(completion => completion === currentUserDetails?.userId) && task.taskType !== TaskType.GROUP) // if the task is not completed by the current user and its not a group task
    )

    const handleClickDone = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        updateTaskCompletion({ taskId: task.taskId, isCompleted: true });
    };

    const handleClickNotDone = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        updateTaskCompletion({ taskId: task.taskId, isCompleted: false });
    };

    if (!displayStatusButton) return null;
    if (taskIsNotCompleted) return (
        <Button
            onClick={handleClickDone}
            size={'sm'}
            variant="subtle"
            colorPalette="green"
        >
            <Icon>
                <IconCheck />
            </Icon>
            {t('task_category.buttons.done')}
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
            {t('task_category.buttons.mark_as_not_done')}
        </Button>
    );
}

export default TaskCompletionButton;