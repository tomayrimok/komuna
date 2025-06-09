import { Box, Icon } from '@chakra-ui/react';
import { IconTool } from '@tabler/icons-react';
import IncidentsNumber from './incidentsNumber';

const IncidentsHeader = () => {

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
      <IncidentsNumber />
    </Box>
  );
};

export default IncidentsHeader;
