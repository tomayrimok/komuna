import { Badge, BadgeProps, BoxProps } from "@chakra-ui/react";
import { TaskType as TaskTypeEnum } from "@komuna/types";
import { TaskType } from "libs/types/src/generated";
import { useTranslation } from "react-i18next";

interface TaskTypeTagProps extends BadgeProps {
    taskType: TaskType;
}

const TaskTypeTag = ({ taskType, ...props }: TaskTypeTagProps) => {

    const { t } = useTranslation();
    const color = taskType === TaskTypeEnum.GROUP ? 'yellow' : 'orange';
    const key = taskType === TaskTypeEnum.GROUP ? 'group_type' : 'personal_type';

    return <Badge colorPalette={color} variant='subtle' w='fit-content' borderRadius='full' {...props as any} >{t(`task_category.create_task.${key}`)}</Badge>
}

export default TaskTypeTag;