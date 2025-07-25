import { Box, Container, Flex, Icon, Text, Badge } from '@chakra-ui/react';
import { IconUser, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { IncidentResponseDto } from 'libs/types/src/generated';
import { UserRole } from '@komuna/types';
import { useAuth } from '../../context/auth/AuthProvider';
import DateText from '../dateText';
import { STATUSES_DATA } from './consts/statuses.data';
import IncidentTag from './incidentTag';
import NumberOfComments from './numberOfComments';
import UrgencyIndication from './urgencyIndication';

interface IncidentCardProps {
  item: IncidentResponseDto;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ item }) => {
  const navigate = useNavigate();

  const numberOfComments = item.comments?.length || 0;
  const {
    sessionDetails: { role },
  } = useAuth();

  return (
    <Box
      backgroundColor={'white'}
      borderWidth={1}
      borderRadius={'xl'}
      onClick={() => navigate({ to: `/${role?.toLowerCase()}/incident/${item.incidentId}` })}
      width="100%"
      key={item.incidentId}
      position={'relative'}
      overflow={'hidden'}
      ps={'10px'}
    >
      <UrgencyIndication item={item} />

      {role === UserRole.LANDLORD && !item.seenByManager && (
        <Box
          position="absolute"
          top={2}
          right={2}
          w={3}
          h={3}
          bg="orange.500"
          borderRadius="full"
          zIndex={10}
        />
      )}

      <Container p={5}>
        <Flex direction={'column'} gap={2} mb={2}>
          <Flex justifyContent="space-between" alignItems="flex-start">
            <Text fontSize="lg" fontWeight="bold" flex={1}>
              {item.title}
            </Text>

            {role === UserRole.LANDLORD && (
              <Badge
                colorPalette={item.seenByManager ? 'green' : 'orange'}
                size="sm"
                borderRadius="full"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Icon>
                  {item.seenByManager ? <IconEye size={12} /> : <IconEyeOff size={12} />}
                </Icon>
                {item.seenByManager ? 'נצפה' : 'חדש'}
              </Badge>
            )}
          </Flex>

          {item.description && (
            <Text color={'gray.500'} whiteSpace={'pre-wrap'} lineHeight={1.2}>
              {item.description}
            </Text>
          )}
          <Flex mt={2} gap={2} alignItems={'center'} flexWrap="wrap">
            <IncidentTag value={item.status} data={STATUSES_DATA} />
            {numberOfComments ? <NumberOfComments number={numberOfComments} /> : null}

            {item.seenByManager && role !== UserRole.LANDLORD && (
              <Badge
                colorPalette="green"
                size="sm"
                borderRadius="full"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Icon><IconEye size={10} /></Icon>
                נצפה
              </Badge>
            )}
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
            {item.reporter.firstName} {item.reporter.lastName}
          </Flex>
          <Text fontSize="sm" direction={'l'} color={'gray.500'}>
            <DateText date={item.createdAt} />
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default IncidentCard;
