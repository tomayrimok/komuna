import { Box, Button, HStack, Text, VStack, Image, Card, List, Stack, Field, Input, Dialog, Portal, CloseButton } from '@chakra-ui/react';
import { useAuth } from '../../context/auth/AuthProvider';
import { LogoutButton } from '../../components/LogoutButton';
import { Trans } from 'react-i18next';
import { useIsRTL } from '../../hooks/useIsRTL';
import { Task } from './Task';
import { NewTask } from './NewTask';
import { useState } from 'react';



export function TasksHome() {
    const { currentUserDetails } = useAuth();
    const { isRTL } = useIsRTL();
    const [open, setOpen] = useState(false);

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
                onClick={() => setOpen(true)}
            >
                <Text fontSize={"5xl"}>
                    +
                </Text>
            </Button>
            <Dialog.Root
                open={open}
                onOpenChange={(e) => setOpen(e.open)}
                size="md"
                placement="center"
            >
                <Dialog.Trigger>
                    {/* You can also leave this empty if you control `open` manually */}
                </Dialog.Trigger>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Create a New Task</Dialog.Title>
                                <Dialog.CloseTrigger>
                                    <CloseButton />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>
                            <Dialog.Body>
                                <NewTask />
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger>
                                    <Button variant="outline">Cancel</Button>
                                </Dialog.ActionTrigger>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
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