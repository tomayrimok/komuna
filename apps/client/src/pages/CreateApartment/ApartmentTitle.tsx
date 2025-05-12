import { Text, VStack } from "@chakra-ui/react"
import { FC } from "react"

interface ApartmentTitleProps {
  title: string;
  description?: string;
}

const ApartmentTitle: FC<ApartmentTitleProps> = ({ title, description }) => {
  return (
    <VStack>
      <Text fontSize="2xl" fontWeight="bold" >
        {title}
      </Text>
      {description ?
        <Text
          fontSize="lg"
          textAlign="center"
          paddingX="10px">
          {description}
        </Text> : null}
    </VStack>
  );
}

export default ApartmentTitle;