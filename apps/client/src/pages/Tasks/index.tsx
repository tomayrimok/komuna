import { Box, Button, HStack, Text, VStack, Image, Card, List, Stack, Field, Input } from '@chakra-ui/react';
import { useAuth } from '../../context/auth/AuthProvider';
import { LogoutButton } from '../../components/LogoutButton';
import { Trans } from 'react-i18next';
import { useIsRTL } from '../../hooks/useIsRTL';
import { Task } from './Task';



export function TasksHome() {
    const { currentUserDetails } = useAuth();
    const { isRTL } = useIsRTL();

    return (
        <Box
            backgroundColor="brand.500"
            flex="1"
            display="flex"
            flexDirection="column"
            gap="0"
            border={"3px solid"}
        >
            <HStack justifyContent="end" paddingX="2" paddingY="1">
                <LogoutButton />
            </HStack>
            <VStack
                paddingY="22px"
                paddingX="25px"
                backgroundColor="brand.10"
                flex="1"
                gap="4"
                borderRadius="88px"
                borderBottomEndRadius="none"
                borderBottomStartRadius="none"
            >
                <Text
                    fontSize="4xl"
                    fontWeight="bold"
                    color="brand.900"
                >
                    <Trans
                        i18nKey={"task_category.title"}
                        components={{ b: <b /> }}
                    />
                </Text>
                <Text
                    fontSize="1xl"
                    fontWeight="bold"
                    color="brand.900"
                    textAlign={isRTL ? "right" : "left"}
                    width={"100%"}
                >
                    <Trans
                        i18nKey={"task_category.task_list"}
                        components={{ b: <b /> }}
                    />
                </Text>
                <Task />
                <Task />
                <Task />
                <Task />
                <Task />
            </VStack>
            <Button
                borderRadius={"3em"}
                width={"60px"}
                height={"60px"}
                position={"fixed"}
                right={"43%"}
                top={"82vh"}
                backgroundColor={"brand.10"}
            >
                <Text fontSize={"5xl"}>
                    +
                </Text>
            </Button>
        </Box>
    );
}





/*
preview:
    title
    due date
    description

full:
    title
    due date
    description
    assigned to
    every...
*/