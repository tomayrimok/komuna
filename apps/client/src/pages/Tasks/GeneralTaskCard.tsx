import { Badge, Card, Flex, HStack, Icon, Tag, Text } from "@chakra-ui/react";
import { Frequency, GeneralTaskResponseDto } from "@komuna/types";
import { IconCheck, IconClock, IconUser, IconX } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import DateText from "../../components/dateText";
import TaskTypeTag from "./TaskTypeTag";

interface GeneralTaskCardProps {
    task: GeneralTaskResponseDto;
}



const GeneralTaskCard = ({ task }: GeneralTaskCardProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleEditTask = (task: GeneralTaskResponseDto) => {
        navigate({ to: `/roommate/general-tasks/${task.generalTaskId}` });
    };

    const getFrequencyText = (frequency: Frequency, interval?: number) => {
        const key = interval === 1 ? 'one' : interval === 2 ? 'two' : 'many';
        return t(`shopping.frequency.${frequency.toLowerCase()}.${key}` as any, { count: interval });
    };

    return (
        <Card.Root key={task.generalTaskId} onClick={() => handleEditTask(task)} cursor={'pointer'}>
            <Card.Header>
                <HStack justifyContent={'space-between'}>
                    <Text fontSize="lg" fontWeight="semibold">
                        {task.title}
                        <TaskTypeTag mb={1} ms={2} taskType={task.taskType} />
                    </Text>
                    <Badge colorPalette={task.isActive ? 'green' : 'gray'}>
                        {task.isActive ? <IconCheck size={16} /> : <IconX size={16} />}
                        {task.isActive ? t('shopping.general_lists.active') : t('shopping.general_lists.inactive')}
                    </Badge>
                </HStack>
            </Card.Header>
            <Card.Body pt={2}>

                {task.description && (
                    <Text whiteSpace={'pre-wrap'} lineHeight={1.2} fontSize="sm" color="gray.500" lineClamp={2} mb={2}>
                        {task.description}
                    </Text>
                )}

                {task.defaultDueTime && (
                    <Text fontSize="sm" color="gray.500">
                        {t('task_category.tasks.due_date')}: {task.defaultDueTime.split(':').slice(0, 2).join(':')}
                    </Text>
                )}

                {task.lastGeneratedAt && (
                    <Text fontSize="sm" color="gray.500">
                        {t('task_category.tasks.last_run')}: <DateText date={task.lastGeneratedAt.toString()} />
                    </Text>
                )}

                {task.nextGenerationAt && task.isActive && (
                    <Text fontSize="sm" color="gray.500">
                        {t('task_category.tasks.next_run')}: <DateText date={task.nextGenerationAt.toString()} />
                    </Text>
                )}

                <HStack gap={2} mt={2}>
                    <Tag.Root colorPalette="blue" variant="subtle" w="fit-content" borderRadius="full">
                        <Tag.Label display={'flex'} alignItems={'center'} gap={1}>
                            <IconClock size={16} />
                            <Text fontSize="kg">
                                {getFrequencyText(task.recurrenceRule.frequency as Frequency, task.recurrenceRule.interval)}
                            </Text>
                        </Tag.Label>
                    </Tag.Root>
                    <Flex fontSize="sm" color="gray.500" alignItems={'center'} gap={1}>
                        <Icon size={'sm'}>
                            <IconUser />
                        </Icon>
                        {task.createdBy.firstName} {task.createdBy.lastName}
                    </Flex>
                </HStack>

            </Card.Body>
        </Card.Root >
    )
}

export default GeneralTaskCard;