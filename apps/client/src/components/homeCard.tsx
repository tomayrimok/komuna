import { Flex, Heading } from "@chakra-ui/react"
import { ReactNode } from "@tanstack/react-router"

interface BalanceTextProps {
    image: ReactNode;
    text: ReactNode;
    button: ReactNode;
}


export const HomeCard: React.FC<BalanceTextProps> = ({ image, text, button }) => {
    return (
        <Flex gap={3} p={8} w="full" borderRadius={"4xl"} direction={"column"} alignItems={"center"} backgroundColor={"white"} borderWidth={1}>
            {image}
            <Heading fontSize={"xl"} textAlign={"center"}>
                {text}
            </Heading>
            {button}
        </Flex>
    )
}