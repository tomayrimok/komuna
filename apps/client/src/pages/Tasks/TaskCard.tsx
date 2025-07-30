import { Badge, Box, Container, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { TaskResponseDto } from 'libs/types/src/generated';
import DueDate from './DueDate';
import TaskCompletionButton from './TaskCompletionButton';
import TaskRoommates from './TaskRoommates';
import { parseDate } from '../../utils/dateUtils';
import TaskTypeTag from './TaskTypeTag';
import CompletionIndication from './CompletionIndication';
import { getTaskCompleted } from '../../utilities/getTaskCompleted';

interface TaskCardProps {
    task: TaskResponseDto;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {

    const navigate = useNavigate();
    const isCompleted = getTaskCompleted(task);

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
                    cursor={'pointer'}
                    backgroundColor={'white'}
                    borderWidth={1}
                    borderRadius={'xl'}
                    onClick={() => navigate({ to: `/roommate/tasks/details/${task.taskId}` })}
                    width="100%"
                    key={task.taskId}
                    position={'relative'}
                    overflow={'hidden'}
                    transition={'0.3s ease-in-out'}
                    filter={isCompleted ? 'grayscale(40%)' : 'none'}
                    opacity={isCompleted ? 0.7 : 1}


                >

                    <CompletionIndication item={task} />

                    <Container p={5}>
                        <Flex direction={'column'} gap={2}>
                            <HStack justifyContent={"space-between"} alignItems={'start'}>
                                <Text fontSize="lg" fontWeight="bold">
                                    <Text me={2} as="span">{task.title}</Text>
                                    <TaskTypeTag mb={1} taskType={task.taskType} />
                                </Text>
                                {task.dueDate && <DueDate dueDate={parseDate(task.dueDate)} />}
                            </HStack>
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
