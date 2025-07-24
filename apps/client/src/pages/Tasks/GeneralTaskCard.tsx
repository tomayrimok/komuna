import { Badge, Card, HStack, Text, IconButton, Flex, Icon, Tag } from "@chakra-ui/react"
import { GeneralTaskResponseDto, Frequency } from "@komuna/types";
import { useAuth } from "../../context/auth/AuthProvider";
import { useNavigate } from "@tanstack/react-router";
import { useDeleteGeneralTask } from "../../hooks/query/useGeneralTasks";
import { IconEdit, IconTrash, IconClock, IconCheck, IconX, IconUser } from "@tabler/icons-react";
import { format } from "date-fns";
import DateText from "../../components/dateText";

interface GeneralTaskCardProps {
    task: GeneralTaskResponseDto;
}

const frequencyText = {
    [Frequency.DAILY]: { one: 'כל יום', two: 'כל יומיים', many: 'כל $ ימים' },
    [Frequency.MONTHLY]: { one: 'כל חודש', two: 'כל חודשיים', many: 'כל $ חודשים' },
    [Frequency.WEEKLY]: { one: 'כל שבוע', two: 'כל שבועיים', many: 'כל $ שבועות' },
    [Frequency.YEARLY]: { one: 'כל שנה', two: 'כל שנתיים', many: 'כל $ שנים' }
}

const GeneralTaskCard = ({ task }: GeneralTaskCardProps) => {
    const navigate = useNavigate();

    const handleEditTask = (task: GeneralTaskResponseDto) => {
        navigate({ to: `/roommate/general-tasks/${task.generalTaskId}` });
    };

    const getFrequencyText = (frequency: Frequency, interval?: number) => {
        return frequencyText[frequency][interval === 1 ? 'one' : interval === 2 ? 'two' : 'many'].replace('$', interval?.toString() || '');
    };

    return (
        <Card.Root key={task.generalTaskId} onClick={() => handleEditTask(task)}>
            <Card.Header>
                <HStack justifyContent={'space-between'}>
                    <Text fontSize="lg" fontWeight="semibold">
                        {task.title}
                    </Text>
                    <Badge colorPalette={task.isActive ? 'green' : 'gray'}>
                        {task.isActive ? <IconCheck size={16} /> : <IconX size={16} />}
                        {task.isActive ? 'פעילה' : 'לא פעילה'}
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
                        זמן ברירת מחדל: {task.defaultDueTime}
                    </Text>
                )}

                {task.lastGeneratedAt && (
                    <Text fontSize="sm" color="gray.500">
                        ההפעלה האחרונה: <DateText date={task.lastGeneratedAt.toString()} />
                    </Text>
                )}

                {task.nextGenerationAt && task.isActive && (
                    <Text fontSize="sm" color="gray.500">
                        ההפעלה הבאה: <DateText date={task.nextGenerationAt.toString()} />
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