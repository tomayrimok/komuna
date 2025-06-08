import { Box, Icon, SkeletonText, Text } from '@chakra-ui/react';
import { IncidentStatus } from '@komuna/types';
import { IconTool } from '@tabler/icons-react';
import { useIncidents } from '../../hooks/query/useIncidents';
import { useTranslation } from 'react-i18next';

const IncidentsHeader = () => {
  const { data, isLoading } = useIncidents();
  const { t } = useTranslation();

  const numberOfOpenIncidents = data?.data?.filter((incident) => incident.status !== IncidentStatus.SOLVED).length || 0;

  return (
    <Box
      width="full"
      height={'18vh'}
      position={'relative'}
      overflow={'hidden'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Box
        minW={'120vw'}
        height={'120vw'}
        borderRadius="50%"
        bg="brand.500"
        position={'absolute'}
        bottom={0}
        right={'-10vw'}
        zIndex={-1}
      />
      <Icon size={'2xl'} mb={3}>
        <IconTool />
      </Icon>
      {!isLoading && data ? (
        <Text fontWeight={'bold'} fontSize="xl">
          {t('incidents.num_open_incidents', { count: numberOfOpenIncidents }) || ''}
        </Text>
      ) : (
        <SkeletonText noOfLines={1} width="50%" m="auto" />
      )}
    </Box>
  );
};

export default IncidentsHeader;
