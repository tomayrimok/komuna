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
      <Icon width={'70px'} height={'60px'} mb={1} fill='brand.100' color='brand.700' mt={-3}>
        <IconTool strokeWidth={0} />
      </Icon>
      <IncidentsNumber />
    </Box>
  );
};

export default IncidentsHeader;
