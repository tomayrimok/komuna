import { Box, Icon, Text } from '@chakra-ui/react';
import { IconMessage } from '@tabler/icons-react';

interface NumberOfCommentsProps {
  number: number;
}

const NumberOfComments: React.FC<NumberOfCommentsProps> = ({ number }) => {
  return (
    <Box position={'relative'}>
      <Icon color={'gray.400'} fontSize={'sm'}>
        <IconMessage />
      </Icon>
      <Box
        position={'absolute'}
        bottom={-1}
        right={-1}
        backgroundColor={'gray.500'}
        borderRadius={'full'}
        width={'14px'}
        height={'14px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Text fontSize="2xs" color={'white'}>
          {number}
        </Text>
      </Box>
    </Box>
  );
};

export default NumberOfComments;
