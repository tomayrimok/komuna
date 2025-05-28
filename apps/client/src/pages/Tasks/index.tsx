import { Box, Button, HStack, Text, VStack, Image, Card, List } from '@chakra-ui/react';
import { useAuth } from '../../context/auth/AuthProvider';
import { LogoutButton } from '../../components/LogoutButton';
import { useNavigate } from '@tanstack/react-router';
import { Trans, useTranslation } from 'react-i18next';

import { useIsRTL } from '../../hooks/useIsRTL';



export function TasksHome() {
    const { currentUserDetails } = useAuth();
    const { t } = useTranslation();
    const isRTL = useIsRTL();
    const navigate = useNavigate();


    return (
        <Box backgroundColor="brand.500" flex="1" display="flex" flexDirection="column" gap="0">
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
                    border={"2px solid"}
                >
                    <Trans
                        i18nKey={"task_category.title"}
                        values={{ title: currentUserDetails?.firstName || "Task Title" }}
                        components={{ b: <b /> }}
                    />
                </Text>
                <Text
                    fontSize="1xl"
                    fontWeight="bold"
                    color="brand.900"
                    textAlign={isRTL ? "right" : "left"}
                    width={"100%"}
                    border={"2px solid"}
                >
                    <Trans
                        i18nKey={"task_category.task_list"}
                        values={{ title: currentUserDetails?.firstName || "Task Title" }}
                        components={{ b: <b /> }}
                    />
                </Text>
                <Task />
            </VStack>
        </Box>
    );
}

export const Task = () => {
    const { currentUserDetails } = useAuth();


    return (
        <Card.Root
            id='task'
            outline="3px ridge"
            borderRadius="2rem"
            outlineColor="brand.800"
            width="90%"
            backgroundColor="brand.500"
            display="flex"
            flexDirection="column"
            height="30vh"
        >
            <List.Root>
                <List.Item>
                    <Text>
                        <Trans
                            i18nKey={"task_category.tasks.title"}
                            values={{ title: currentUserDetails?.firstName || "Task Title" }}
                            components={{ b: <b /> }}
                        />
                    </Text>
                </List.Item>
                <List.Item>
                    <Text>
                        <Trans
                            i18nKey={"task_category.tasks.title"}
                            values={{ title: currentUserDetails?.firstName || "Due Date" }}
                            components={{ b: <b /> }}
                        />
                    </Text>
                </List.Item>
                <List.Item>
                    <Text>
                        <Trans
                            i18nKey={"task_category.tasks.title"}
                            values={{ title: currentUserDetails?.firstName || "Description" }}
                            components={{ b: <b /> }}
                        />
                    </Text>
                </List.Item>
                <List.Item>
                    <Text>
                        <Trans
                            i18nKey={"task_category.tasks.title"}
                            values={{ title: currentUserDetails?.firstName || "Assigned to" }}
                            components={{ b: <b /> }}
                        />
                    </Text>
                </List.Item>
                <List.Item>
                    <Text>
                        <Trans
                            i18nKey={"task_category.tasks.title"}
                            values={{ title: currentUserDetails?.firstName || "Recurrence" }}
                            components={{ b: <b /> }}
                        />
                    </Text>
                </List.Item>
                <List.Item>
                    <Text>
                        <Trans
                            i18nKey={"task_category.tasks.title"}
                            values={{ title: currentUserDetails?.firstName || "Assigned By" }}
                            components={{ b: <b /> }}
                        />
                    </Text>
                </List.Item>
            </List.Root>
        </Card.Root>
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