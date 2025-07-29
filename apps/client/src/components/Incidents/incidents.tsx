import { Flex, For, Image, SkeletonText, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { IncidentStatus, IncidentUrgency } from '@komuna/types';
import { useIncidents } from '../../hooks/query/useIncidents';
import IncidentCard from './incidentCard';

const Incidents = () => {
  const { data, isLoading } = useIncidents();
  const { t } = useTranslation();

  const solvedIncidents = data?.data?.filter((incident) => incident.status === IncidentStatus.SOLVED) || [];
  const unsolvedIncidents = data?.data?.filter((incident) => incident.status !== IncidentStatus.SOLVED) || [];
  const sortedUnSolvedIncidentsByUrgency = unsolvedIncidents.sort((a, b) => {
    const urgencyOrder = {
      [IncidentUrgency.EXTREME]: 3,
      [IncidentUrgency.HIGH]: 2,
      [IncidentUrgency.MEDIUM]: 1,
      [IncidentUrgency.LOW]: 0,
    };
    return urgencyOrder[b.urgencyLevel] - urgencyOrder[a.urgencyLevel];
  });


  return (
    <Flex gap="2" direction="column" width="100%" p={6} pb={11}>
      {isLoading && <SkeletonText noOfLines={1} width="50%" mb="2" />}
      {data?.data &&
        (!data.data?.length ? (
          <Flex flexDirection="column" alignItems="center" justifyContent="center" mt="15vh">
            <Image src="/meerkats/relaxing.png" width="80vw" />
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              {t('incidents.no_incidents')}
            </Text>
          </Flex>
        ) : (
          <>
            {sortedUnSolvedIncidentsByUrgency.length ? (
              <>
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  {t('incidents.open_incidents')}
                </Text>
                <For each={unsolvedIncidents}>{(item) => <IncidentCard key={item.incidentId} item={item} />}</For>
              </>
            ) : null}
            {solvedIncidents.length ? (
              <>
                <Text fontSize="xl" fontWeight="bold" mb={2} mt={4}>
                  {t('incidents.solved_incidents')}
                </Text>
                <For each={solvedIncidents}>{(item) => <IncidentCard key={item.incidentId} item={item} />}</For>
              </>
            ) : null}
          </>
        ))}
    </Flex>
  );
};

export default Incidents;
