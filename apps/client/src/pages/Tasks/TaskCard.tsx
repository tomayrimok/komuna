import { Box, Container, Flex, Icon, Text } from '@chakra-ui/react';
import { IconUser } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { IncidentResponseDto } from 'libs/types/src/generated';
import { useAuth } from '../../context/auth/AuthProvider';
// import DateText from '../dateText';
// import { STATUSES_DATA } from './consts/statuses.data';
// import IncidentTag from './incidentTag';
// import NumberOfComments from './numberOfComments';
// import UrgencyIndication from './urgencyIndication';

interface TaskCardProps {
    task: any;
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
            onClick={() => navigate({ to: `/${role?.toLowerCase()}/incident/${task.incidentId}` })}
            width="100%"
            key={task.incidentId}
            position={'relative'}
            overflow={'hidden'}
            ps={'10px'}
        >
            {/* <UrgencyIndication task={task} /> */}

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
                    <Flex mt={2} gap={2}>
                        {/* <IncidentTag value={task.status} data={STATUSES_DATA} />
            {numberOfComments ? <NumberOfComments number={numberOfComments} /> : null} */}
                        {/* <IncidentTag value={task.urgencyLevel} data={URGENCY_DATA} /> */}
                    </Flex>
                </Flex>
            </Container>

            <hr />
            <Container p={5}>
                <Flex direction={'row'} justifyContent={'space-between'} w="full">
                    <Flex fontSize="sm" color="gray.500" alignItems={'center'} gap={1}>
                        <Icon size={'sm'}>
                            <IconUser />
                        </Icon>
                        {task.createdBy}
                    </Flex>
                    <Text fontSize="sm" direction={'l'} color={'gray.500'}>
                        {/* <DateText date={task.createdAt} /> */}
                    </Text>
                </Flex>
            </Container>
        </Box>
    );
};

export default TaskCard;
