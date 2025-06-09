import { Box, Button, HStack, Text, VStack, Dialog, Portal, CloseButton } from '@chakra-ui/react';
import { useAuth } from '../../context/auth/AuthProvider';
import { LogoutButton } from '../../components/LogoutButton';
import { Trans, useTranslation } from 'react-i18next';
import { useIsRTL } from '../../hooks/useIsRTL';
import { Task } from './Task';
import { NewTask } from './NewTask';
import { NewTaskTest } from './NewTaskTest';
import { useState, useEffect } from 'react';
import { CreateTaskReqDto as TaskStruct } from '@komuna/types';

export function TasksHome() {
    const { sessionDetails, currentUserDetails } = useAuth();
    const { isRTL } = useIsRTL();
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [completedTasks, setCompletedTasks] = useState<TaskStruct[] | null>(null);
    const [completedTasksCounter, setCompletedTasksCounter] = useState<number>(0);
    const userId = currentUserDetails?.userId || '';
    const apartmentId = sessionDetails.apartmentId || '';

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
                align={"center"}
            >
                <Box w="100%" position="relative" marginTop={"20px"} marginBottom={"20px"}>
                    {/* Absolutely center the title */}
                    <Text
                        position="absolute"
                        left="50%"
                        top="50%"
                        transform="translate(-50%, -50%)"
                        fontSize="4xl"
                        fontWeight="bold"
                        color="brand.900"
                        textAlign="center"
                    >
                        <Trans
                            i18nKey={"task_category.title"}
                            components={{ b: <b /> }}
                        />
                    </Text>

                    {/* Position the button at the right edge */}
                    <Button
                        position="absolute"
                        left="25px"
                        top="50%"
                        transform="translateY(-50%)"
                        borderRadius="3em"
                        width="60px"
                        height="60px"
                        backgroundColor="brand.500"
                        onClick={() => setOpen(true)}
                    >
                        <Text fontSize="5xl">+</Text>
                    </Button>
                </Box>
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
                <Button
                    width={"50%"}
                    height={"50px"}
                    onClick={() => setCompletedTasksCounter(prev => prev + 1)}
                    fontWeight={"bold"}
                >
                    {t("task_category.load_tasks")}
                </Button>
            </VStack>

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
                        <Dialog.Content backgroundColor={"brand.10"}>
                            <Dialog.Header>
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