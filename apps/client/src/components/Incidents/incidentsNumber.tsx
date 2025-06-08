import { SkeletonText, Text } from '@chakra-ui/react';
import { IncidentStatus } from '@komuna/types';
import { useTranslation } from 'react-i18next';
import { useIncidents } from '../../hooks/query/useIncidents';

const IncidentsNumber = () => {
    const { data, isLoading } = useIncidents();
    const { t } = useTranslation();

    const numberOfOpenIncidents = data?.data?.filter((incident) => incident.status !== IncidentStatus.SOLVED).length || 0;

    if (isLoading || !data) {
        return <SkeletonText noOfLines={1} width="50%" m="auto" />;
    }

    return (
        <Text fontWeight={'bold'} fontSize="xl">
            {t('incidents.num_open_incidents', { count: numberOfOpenIncidents }) || ''}
        </Text>
    );
};

export default IncidentsNumber;
