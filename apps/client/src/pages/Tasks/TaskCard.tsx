import { Box, Container, Flex, Icon, Text } from '@chakra-ui/react';
import { IconUser } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { IncidentResponseDto, TaskResponseDto } from 'libs/types/src/generated';
import { useAuth } from '../../context/auth/AuthProvider';
// import DateText from '../dateText';
// import { STATUSES_DATA } from './consts/statuses.data';
// import IncidentTag from './incidentTag';
// import NumberOfComments from './numberOfComments';
// import UrgencyIndication from './urgencyIndication';

interface TaskCardProps {
    task: TaskResponseDto;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const navigate = useNavigate();

    // const numberOfComments = task.comments?.length || 0;
    const {
        sessionDetails: { role },
    } = useAuth();

    return (
        <Box
            backgroundColor={'white'}
            borderWidth={1}
            borderRadius={'xl'}
            onClick={() => navigate({ to: `/${role?.toLowerCase()}/tasks/details/${task.taskId}` })}
            width="100%"
            key={task.taskId}
            position={'relative'}
            overflow={'hidden'}
        >
            <Container p={5}>
                <Flex direction={'column'} gap={2} mb={2}>
                    <Text fontSize="lg" fontWeight="bold">
                        {task.title}
                    </Text>
                    {task.description && (
                        <Text color={'gray.500'} whiteSpace={'pre-wrap'} lineHeight={1.2}>
                            {task.description}
                        </Text>
                    )}
                    <Flex gap={2} flexWrap="wrap" mt={2}>
                      {task.assignedTo?.map((user) => (
                        <Box
                          key={user.userId}
                          display="flex"
                          alignItems="center"
                          px={3}
                          py={1}
                          borderRadius="full"
                          backgroundColor="gray.100"
                          fontSize="sm"
                          fontWeight="medium"
                          color="gray.700"
                          boxShadow="sm"
                        >
                          <Icon as={IconUser} boxSize={4} mr={1} />
                          {user.firstName} {user.lastName[0]}.
                        </Box>
                      ))}
                    </Flex>
                </Flex>
            </Container>

        </Box>
    );
};

export default TaskCard;
