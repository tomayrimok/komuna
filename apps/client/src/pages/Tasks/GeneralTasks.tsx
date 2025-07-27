import {
    Box,
    Button,
    Flex,
    Image,
    Loader,
    Stack,
    Text
} from '@chakra-ui/react';
import { IconPlayerPlay, IconRepeat } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toaster } from '../../chakra/ui/toaster';
import MainButton from '../../components/mainButton';
import {
    useDeleteGeneralTask,
    useGeneralTasks,
    useManuallyGenerateTasks
} from '../../hooks/query/useGeneralTasks';
import ApartmentLayout from '../NewApartment/ApartmentLayout';
import GeneralTaskCard from './GeneralTaskCard';


const GeneralTasks: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data: generalTasks, isLoading, error } = useGeneralTasks();

    const deleteMutation = useDeleteGeneralTask();
    const generateTasksMutation = useManuallyGenerateTasks();

    const handleCreateTask = () => {
        navigate({ to: '/roommate/general-tasks/create' });
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
                description: t('tasks.general_tasks.tasks_created'),
                type: 'success',
            });
        } catch (error) {
            toaster.create({
                description: t('tasks.general_tasks.tasks_creation_error'),
                type: 'error',
            });
        }
    };


    if (isLoading) {
        return (
            <Flex direction="column" align="center" justify="center" h="200px" color="gray.500">
                <Loader />
            </Flex>
        );
    }

    if (error) {
        return (
            <Box p={6}>
                <Text color="red.500">Error loading general tasks</Text>
            </Box>
        );
    }

    const sortedTasks = generalTasks?.sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return 0;
    });

    return (
        <ApartmentLayout
            title={t('roommate.homepage.leftbar.notifications_settings')}
            mt={0}
            goBack={() => navigate({ to: '/roommate' })}
            borderRadius={"40px"}
            containerProps={{ pt: 8 }}
        >
            <Box pb={12}>

                {generalTasks?.length ? (
                    <Button
                        onClick={handleGenerateTasks}
                        variant="subtle"
                        loading={generateTasksMutation.isPending}
                        mb={4}
                    >
                        <IconPlayerPlay size={16} />
                        {t('task_category.create_task.calculate_tasks')}
                    </Button>
                ) : null}

                <Stack gap="4">
                    {sortedTasks?.map((task) => (
                        <GeneralTaskCard key={task.generalTaskId} task={task} />
                    ))}

                    {(!generalTasks || generalTasks.length === 0) && (
                        <Flex flexDirection="column" alignItems="center" justifyContent="center" mt="22vh">
                            <Image src="/meerkats/relaxing.png" width="80vw" />
                            <Text fontSize="xl" fontWeight="bold" mb={2}>
                                {t('task_category.create_task.no_tasks')}
                            </Text>
                        </Flex>
                    )}
                </Stack>
            </Box>
            <MainButton
                onClick={handleCreateTask}
            >
                <IconRepeat size={16} />
                {t('task_category.create_task.create_task')}
            </MainButton>
        </ApartmentLayout>
    );
};

export default GeneralTasks; 