import { Avatar, Box, Flex, Icon, Text } from "@chakra-ui/react"
import { IconCheck } from '@tabler/icons-react';

interface UserCardProps {
    onClick?: () => void;
    user: {
        firstName: string;
        lastName: string;
        image?: string;
        phoneNumber: string | null;
    }
    additionalComponent?: React.ReactNode;
    selected?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, additionalComponent, selected, onClick }) => {

    return (
        <Box
            p={2}
            shadow="sm"
            borderRadius={"md"}
            cursor={onClick ? "pointer" : "default"}
            _hover={onClick ? { backgroundColor: "gray.100" } : {}}
            onClick={onClick}
            border={selected ? "1.5px solid {colors.brand.600}" : "1.5px solid transparent"}
        >
            <Flex direction="row" gap="3" alignItems="center">
                <Avatar.Root size="lg" shape="full">
                    <Avatar.Image src={user.image} alt={user.firstName} />
                    <Avatar.Fallback name={`${user.firstName} ${user.lastName}`} />
                </Avatar.Root>
                <Flex direction="column" flexGrow={1}>
                    <Text fontSize="lg" fontWeight="bold">
                        {user.firstName} {user.lastName}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        {user.phoneNumber}
                    </Text>
                </Flex>
                {additionalComponent}
                {selected && (
                    <Icon color={"brand.600"} size={"lg"} me={1}>
                        <IconCheck />
                    </Icon>
                )}
            </Flex>
        </Box>
    )
}

export default UserCard