import { Stack } from '@chakra-ui/react';
import IncidentsHeader from './incidentsHeader';
import CreateIncidentButton from './createIncidentButton';
import Incidents from './incidents';

const IncidentsPage = () => {
  return (
    <Stack gap="4" direction="row" wrap="wrap">
      <IncidentsHeader />
      <Incidents />
      <CreateIncidentButton />
    </Stack>
  );
};

export default IncidentsPage;
