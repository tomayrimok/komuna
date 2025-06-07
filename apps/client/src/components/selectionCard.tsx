import { Avatar, Box, Flex, Icon, Text } from '@chakra-ui/react';
import { IconCheck } from '@tabler/icons-react';

interface SelectionCardProps {
  onClick?: () => void;
  title: string;
  description?: string;
  image?: string;
  additionalComponent?: React.ReactNode;
  selected?: boolean;
  fallbackIcon?: React.ReactNode;
}

//todo noam change usercard to this

const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  image,
  additionalComponent,
  selected,
  fallbackIcon,
  onClick,
}) => {
  return (
    <Box
      w="full"
      p={2}
      shadow="sm"
      borderRadius={'md'}
      cursor={onClick ? 'pointer' : 'default'}
      _hover={onClick ? { backgroundColor: 'gray.100' } : {}}
      onClick={onClick}
      border={selected ? '1.5px solid {colors.brand.600}' : '1.5px solid transparent'}
    >
      <Flex direction="row" gap="3" alignItems="center">
        <Avatar.Root size="lg" shape="full">
          <Avatar.Image src={image} alt={title} />
          {fallbackIcon ? <Avatar.Fallback>{fallbackIcon}</Avatar.Fallback> : <Avatar.Fallback name={title} />}
        </Avatar.Root>
        <Flex direction="column" flexGrow={1}>
          <Text fontSize="lg" fontWeight="bold">
            {title}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {description}
          </Text>
        </Flex>
        {additionalComponent}
        {selected && (
          <Icon color={'brand.600'} size={'lg'} me={1}>
            <IconCheck />
          </Icon>
        )}
      </Flex>
    </Box>
  );
};

export default SelectionCard;
