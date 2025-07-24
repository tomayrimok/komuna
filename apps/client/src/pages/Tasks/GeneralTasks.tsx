import {
    Box,
    Button,
    Flex,
    Image,
    Loader,
    Stack,
    Text,
    VStack
} from '@chakra-ui/react';
import { IconPlayerPlay, IconRepeat } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toaster } from '../../chakra/ui/toaster';
import { BackNavigationBar } from '../../components/BackNavigationBar';
import MainButton from '../../components/mainButton';
import {
    useDeleteGeneralTask,
    useGeneralTasks,
    useManuallyGenerateTasks
} from '../../hooks/query/useGeneralTasks';
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
                description: 'המשימות נוצרו בהצלחה. ניתן לצפות בהן בדף המשימות.',
                type: 'success',
            });
        } catch (error) {
            toaster.create({
                description: 'שגיאה ביצירת המשימות',
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
        <Box h="full">
            <BackNavigationBar />
            <Box p={6} pb={12}>
                <VStack alignItems="start" gap="4" mb={6}>
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
                            חישוב משימות חדשות כעת
                        </Button>
                    ) : null}
                </VStack>

                <Stack gap="4">
                    {sortedTasks?.map((task) => (
                        <GeneralTaskCard key={task.generalTaskId} task={task} />
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
            </Box>
            <MainButton
                onClick={handleCreateTask}
            >
                <IconRepeat size={16} />
                יצירת תבנית משימה
            </MainButton>
        </Box>
    );
};

export default GeneralTasks; 