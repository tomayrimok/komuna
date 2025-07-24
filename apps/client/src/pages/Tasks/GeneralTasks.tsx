import React, { useState } from 'react';
import {
    Box,
    Text,
    Button,
    Card,
    Stack,
    Flex,
    Badge,
    VStack,
    HStack,
    Input,
    Textarea,
    Field,
    Select,
    createListCollection,
    IconButton,
    Drawer,
    Portal,
    CloseButton,
    Image
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IconPlus, IconEdit, IconTrash, IconPlayerPlay, IconClock, IconTemplate, IconChecklist, IconListDetails, IconLayoutList, IconCheckupList, IconRepeat } from '@tabler/icons-react';
import { Frequency, GeneralTaskResponseDto, TaskType } from '@komuna/types';
import {
    useGeneralTasks,
    useCreateGeneralTask,
    useUpdateGeneralTask,
    useDeleteGeneralTask,
    useManuallyGenerateTasks
} from '../../hooks/query/useGeneralTasks';
import { useAuth } from '../../context/auth/AuthProvider';
import { format } from 'date-fns';
import { toaster } from '../../chakra/ui/toaster';
import MainButton from '../../components/mainButton';
import GeneralTaskDetails from './GeneralTaskDetails';




const GeneralTasks: React.FC = () => {
    const { t } = useTranslation();
    const { data: generalTasks, isLoading, error } = useGeneralTasks();
    const { currentUserDetails, sessionDetails } = useAuth();

    const [selectedTask, setSelectedTask] = useState<GeneralTaskResponseDto | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);


    const deleteMutation = useDeleteGeneralTask();
    const generateTasksMutation = useManuallyGenerateTasks();


    const handleCreateTask = () => {
        setSelectedTask(null);
        setIsEditing(false);
        setIsDrawerOpen(true);
    };

    const handleEditTask = (task: GeneralTaskResponseDto) => {
        setSelectedTask(task);
        setIsEditing(true);
        setIsDrawerOpen(true);
    };

    const handleDelete = async (taskId: string) => {
        try {
            await deleteMutation.mutateAsync(taskId);
            toaster.create({
                title: 'Success',
                description: 'General task deleted successfully',
                type: 'success',
            });
        } catch (error) {
            toaster.create({
                title: 'Error',
                description: 'Failed to delete general task',
                type: 'error',
            });
        }
    };

    const handleGenerateTasks = async () => {
        try {
            await generateTasksMutation.mutateAsync();
            toaster.create({
                title: 'Success',
                description: 'Tasks generated successfully',
                type: 'success',
            });
        } catch (error) {
            toaster.create({
                title: 'Error',
                description: 'Failed to generate tasks',
                type: 'error',
            });
        }
    };

    const getFrequencyText = (frequency: Frequency, interval?: number) => {
        const intervalText = interval && interval > 1 ? `כל ${interval} ` : 'כל ';
        switch (frequency) {
            case Frequency.DAILY:
                return `${intervalText}${interval === 1 ? 'יום' : 'ימים'}`;
            case Frequency.WEEKLY:
                return `${intervalText}${interval === 1 ? 'שבוע' : 'שבועות'}`;
            case Frequency.MONTHLY:
                return `${intervalText}${interval === 1 ? 'חודש' : 'חודשים'}`;
            case Frequency.YEARLY:
                return `${intervalText}${interval === 1 ? 'שנה' : 'שנים'}`;
            default:
                return 'Unknown frequency';
        }
    };

    if (isLoading) {
        return (
            <Box p={6}>
                <Text>Loading general tasks...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={6}>
                <Text color="red.500">Error loading general tasks</Text>
            </Box>
        );
    }

    return (
        <Box p={6} h="full">
            <VStack alignItems="start" gap="4" mb={6} >
                <Text fontSize="2xl" fontWeight="bold">
                    {t('roommate.homepage.leftbar.notifications_settings')}
                </Text>
                {generalTasks?.length ? (
                    <Button
                        onClick={handleGenerateTasks}
                        variant="subtle"
                        loading={generateTasksMutation.isPending}
                    >
                        <IconPlayerPlay size={16} />
                        חישוב משימות חדשות עכשיו
                    </Button>
                ) : null}
            </VStack>
            <MainButton
                onClick={handleCreateTask}
            >
                <IconRepeat size={16} />
                יצירת תבנית משימה
            </MainButton>

            <Stack gap="4">
                {generalTasks?.map((task) => (
                    <Card.Root key={task.generalTaskId}>
                        <Card.Header>
                            <HStack>
                                <Text fontSize="lg" fontWeight="semibold">
                                    {task.title}
                                </Text>
                                <Badge colorScheme={task.isActive ? 'green' : 'gray'}>
                                    {task.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                <Badge colorScheme="blue">{task.taskType}</Badge>
                                {currentUserDetails?.userId === task.createdBy.userId && (
                                    <HStack>
                                        <IconButton
                                            aria-label="Edit task"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEditTask(task)}
                                        >
                                            <IconEdit size={16} />
                                        </IconButton>
                                        <IconButton
                                            aria-label="Delete task"
                                            size="sm"
                                            variant="ghost"
                                            colorPalette="red"
                                            onClick={() => handleDelete(task.generalTaskId)}
                                            loading={deleteMutation.isPending}
                                        >
                                            <IconTrash size={16} />
                                        </IconButton>
                                    </HStack>
                                )}
                            </HStack>
                        </Card.Header>
                        <Card.Body>

                            {task.description && (
                                <Text color="gray.600">{task.description}</Text>
                            )}

                            <HStack>
                                <IconClock size={16} />
                                <Text fontSize="sm" color="gray.500">
                                    {getFrequencyText(task.recurrenceRule.frequency as Frequency, task.recurrenceRule.interval)}
                                </Text>
                            </HStack>

                            {task.defaultDueTime && (
                                <Text fontSize="sm" color="gray.500">
                                    זמן ברירת מחדל: {task.defaultDueTime}
                                </Text>
                            )}

                            {task.lastGeneratedAt && (
                                <Text fontSize="sm" color="gray.500">
                                    הפעלה אחרונה: {format(new Date(task.lastGeneratedAt), 'MMM d, yyyy')}
                                </Text>
                            )}

                            {task.nextGenerationAt && (
                                <Text fontSize="sm" color="gray.500">
                                    הפעלה הבאה: {format(new Date(task.nextGenerationAt), 'MMM d, yyyy')}
                                </Text>
                            )}

                            <Text fontSize="sm" color="gray.500">
                                נוצר על ידי: {task.createdBy.firstName} {task.createdBy.lastName}
                            </Text>

                        </Card.Body>
                    </Card.Root>
                ))}

                {(!generalTasks || generalTasks.length === 0) && (
                    <Flex flexDirection="column" alignItems="center" justifyContent="center" mt="22vh">
                        <Image src="/meerkats/relaxing.png" width="80vw" />
                        <Text fontSize="xl" fontWeight="bold" mb={2}>
                            אין תבניות משימות זמינות
                        </Text>
                    </Flex>
                )}
            </Stack>

            {/* Create/Edit Drawer */}
            <GeneralTaskDetails selectedTask={selectedTask} setSelectedTask={setSelectedTask} setIsDrawerOpen={setIsDrawerOpen} setIsEditing={setIsEditing} isDrawerOpen={isDrawerOpen} isEditing={isEditing} />

        </Box>
    );
};

export default GeneralTasks; 