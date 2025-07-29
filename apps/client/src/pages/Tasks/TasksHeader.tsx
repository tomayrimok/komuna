import { Box, Icon } from '@chakra-ui/react';
import { IconListCheck } from '@tabler/icons-react';
import TasksNumber from './TasksNumber';

const TasksHeader = () => {

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
      <Icon width={'70px'} height={'60px'} mb={1} color='brand.100' mt={-3}>
        <IconListCheck />
      </Icon>
      <TasksNumber />
    </Box>
  );
};

export default TasksHeader;
