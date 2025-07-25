import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  IconButton,
  Loader,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { IncidentStatus } from '@komuna/types';
import { IconEdit, IconSend2 } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/auth/AuthProvider';
import { IncidentProvider, useIncident } from '../../context/incidents/IncidentProvider';
import { useIsRTL } from '../../hooks/useIsRTL';
import { withWrappers } from '../../utilities/withWrappers';
import DateText from '../dateText';
import { INCIDENT_STATUSES, STATUSES_DATA } from './consts/statuses.data';
import { URGENCY_DATA } from './consts/urgency.data';
import IncidentTag from './incidentTag';
import ApartmentLayout from '../../pages/NewApartment/ApartmentLayout';

const IncidentPage = () => {
  const { incidentDetails, incidentId, updateIncidentDetails, addComment, newComment, setNewComment } = useIncident();

  const navigate = useNavigate();
  const {
    sessionDetails: { role },
  } = useAuth();
  const { isRTL } = useIsRTL();
  const { t } = useTranslation();

  if (!incidentDetails) return <Loader />;

  return (
    <ApartmentLayout goBack={() => navigate({ to: `/${role?.toLowerCase()}/incidents` })}>
      <Heading fontSize="2xl" fontWeight="bold" textAlign={"center"} mb={2}>פרטי התקלה</Heading>
      <Box p={4} borderWidth={1} borderRadius="xl" bg="white">
        <Flex justifyContent="space-between" alignItems="top">
          <Heading>{incidentDetails?.title}</Heading>
          <IconButton
            onClick={() => navigate({ to: `/${role?.toLowerCase()}/incident/details/${incidentId}` })}
            color={'gray.500'}
            variant={'ghost'}
          >
            <IconEdit />
          </IconButton>
        </Flex>
        <Text>{incidentDetails?.description}</Text>
        <Flex mt={3} gap={2}>
          <IncidentTag value={incidentDetails?.status} data={STATUSES_DATA} />
          <IncidentTag value={incidentDetails?.urgencyLevel} data={URGENCY_DATA} />
        </Flex>
      </Box>
      <Box p={4} borderWidth={1} borderRadius="xl" bg="white">
        <Heading>{t('incidents.update_status')}</Heading>
        <Flex gap={2} mt={3}>
          {INCIDENT_STATUSES.map((status) => (
            <Button
              key={status.value}
              onClick={() => updateIncidentDetails({ status: status.value as IncidentStatus })}
              backgroundColor={incidentDetails.status === status.value ? status.backgroundColor : 'gray.100'}
              color={incidentDetails.status === status.value ? status.color : 'gray.600'}
              py={0}
              px={4}
            >
              <Icon>{status.icon}</Icon>
              {t(status.text as any)}
            </Button>
          ))}
        </Flex>
      </Box>
      <Box p={4} borderWidth={1} borderRadius="xl" bg="white">
        <Heading>{t('incidents.notes_and_updates')}</Heading>
        <Flex direction={'column'} gap={3} mt={3}>
          {incidentDetails?.comments?.map((comment, index) => (
            <Box key={index} p={3} borderWidth={1} borderRadius="md" bg="gray.50">
              <Flex direction={'column'}>
                <Text
                  fontWeight="bold"
                  fontSize={'sm'}
                  color={'brand.700'}
                >{`${comment.user.firstName} ${comment.user.lastName}`}</Text>
                <Text>{comment.message}</Text>
                <Text fontSize="sm" direction={'l'} color={'gray.500'} ms={'auto'}>
                  <DateText date={comment.createdAt} />
                </Text>
              </Flex>
            </Box>
          ))}
          <Flex alignItems={'center'} gap={2}>
            <Textarea
              placeholder={t('incidents.add_note')}
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment || ''}
              rows={1}
              resize={'none'}
            />
            <Button colorScheme="blue" onClick={addComment}>
              <IconSend2 style={{ transform: isRTL ? 'scaleX(-1)' : '' }} />
            </Button>
          </Flex>
        </Flex>
      </Box>
    </ApartmentLayout>
    //   </Container>
    // </Box>
  );
};

export default withWrappers(IncidentPage, [IncidentProvider]);
