import { BoxProps, Text, VStack } from '@chakra-ui/react';
import { FC } from 'react';

interface ApartmentTitleProps extends BoxProps {
  title: string;
  description?: string;
}

export const ApartmentTitle: FC<ApartmentTitleProps> = ({ title, description }) => {
  return (
    <VStack>
      <Text fontSize="2xl" fontWeight="bold">
        {title}
      </Text>
      {description ? (
        <Text fontSize="lg" textAlign="center" paddingX="10px">
          {description}
        </Text>
      ) : null}
    </VStack>
  );
};
