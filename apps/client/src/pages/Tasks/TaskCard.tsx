import { Box, Container, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { TaskResponseDto } from 'libs/types/src/generated';
import DueDate from './DueDate';
import TaskCompletionButton from './TaskCompletionButton';
import TaskRoommates from './TaskRoommates';

interface TaskCardProps {
    task: TaskResponseDto;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {

    const navigate = useNavigate();

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
                            <Flex justifyContent={"space-between"}>
                                <Text fontSize="lg" fontWeight="bold">
                                    {task.title}
                                </Text>
                                {task.dueDate && <DueDate dueDate={new Date(task.dueDate)} />}
                            </Flex>
                            {task.description && (
                                <Text color={'gray.500'} whiteSpace={'pre-wrap'} lineHeight={1.2}>
                                    {task.description}
                                </Text>
                            )}
                        </Flex>
                        <Flex mt={3}>
                            <Flex justifyContent={'space-between'} w="full">
                                <TaskRoommates task={task} />
                                <TaskCompletionButton task={task} />
                            </Flex>

                        </Flex>
                    </Container>

                </Box>
            </motion.div>
        </AnimatePresence>
    );
};

export default TaskCard;
