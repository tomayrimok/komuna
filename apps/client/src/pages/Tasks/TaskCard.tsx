import { Avatar, Box, Button, Container, Flex, Icon, Text } from '@chakra-ui/react';
import { TaskType } from '@komuna/types';
import { IconCheck, IconReload } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { TaskResponseDto } from 'libs/types/src/generated';
import { useMemo } from 'react';
import { Tooltip } from '../../chakra/ui/tooltip';
import { useAuth } from '../../context/auth/AuthProvider';
import { useUpdateTaskCompletion } from '../../hooks/useUpdateTaskCompletion';

interface TaskCardProps {
    task: TaskResponseDto;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const navigate = useNavigate();
    const { currentUserDetails } = useAuth();

    const { mutate: updateTaskCompletion } = useUpdateTaskCompletion();

    const displayStatusButton = useMemo(() => {
        const assignedToCurrentUser = task.assignedTo?.some(user => user.userId === currentUserDetails?.userId);
        const isGroupTask = task.taskType === TaskType.GROUP;
        return (assignedToCurrentUser || isGroupTask || (task.assignedTo?.length === 0));
    }, [task]);

    const showDoneButton = ((!task.completions?.some(completion => completion === currentUserDetails?.userId)) || (task.completions?.length === 0 && task.assignedTo?.length === 0))
    console.log('showDoneButton :', showDoneButton);

    const handleClickDone = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        updateTaskCompletion({ taskId: task.taskId, isCompleted: true });
        // api call to mark task as done
    };

    const handleClickNotDone = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        updateTaskCompletion({ taskId: task.taskId, isCompleted: false });
        // api call to mark task as not done
    };

    return (
        <AnimatePresence>
            <motion.div
                key={task.taskId}
                layout
                initial={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <Box
                    backgroundColor={'white'}
                    borderWidth={1}
                    borderRadius={'xl'}
                    onClick={() => navigate({ to: `/roommate/tasks/details/${task.taskId}` })}
                    width="100%"
                    key={task.taskId}
                    position={'relative'}
                    overflow={'hidden'}
                >

                    <Container p={5}>
                        <Flex direction={'column'} gap={2}>
                            <Text fontSize="lg" fontWeight="bold">
                                {task.title}
                            </Text>
                            {task.description && (
                                <Text color={'gray.500'} whiteSpace={'pre-wrap'} lineHeight={1.2}>
                                    {task.description}
                                </Text>
                            )}
                        </Flex>
                        <Flex mt={3}>
                            <Flex justifyContent={'space-between'} w="full">
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
                                {displayStatusButton &&
                                    (showDoneButton ?
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
                                        :
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
                                    )
                                }
                            </Flex>

                        </Flex>
                    </Container>

                </Box>
            </motion.div>
        </AnimatePresence>
    );
};

export default TaskCard;
