import { Card, List, Text, Button } from "@chakra-ui/react";
import { useAuth } from '../../context/auth/AuthProvider';
import { Trans } from 'react-i18next';
import { useIsRTL } from '../../hooks/useIsRTL';



export const Task = () => {
    const { currentUserDetails } = useAuth();
    const { isRTL } = useIsRTL();
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
            height="auto"
        >
            <Card.Body>
                <List.Root color={"brand.900"}>
                    <List.Item>
                        <Text>
                            <Trans
                                i18nKey={"task_category.tasks.title"}
                                values={{ taskName: currentUserDetails?.firstName || "Task Title" }}
                                components={{ b: <b /> }}
                            />
                        </Text>
                    </List.Item>
                    <List.Item>
                        <Text>
                            <Trans
                                i18nKey={"task_category.tasks.due_date"}
                                values={{ dueDate: currentUserDetails?.firstName || "Due Date" }}
                                components={{ b: <b /> }}
                            />
                        </Text>
                    </List.Item>
                    <List.Item>
                        <Text>
                            <Trans
                                i18nKey={"task_category.tasks.descrption"}
                                values={{ description: currentUserDetails?.firstName || "Description" }}
                                components={{ b: <b /> }}
                            />
                        </Text>
                    </List.Item>
                    <List.Item>
                        <Text>
                            <Trans
                                i18nKey={"task_category.tasks.assigned_to"}
                                values={{ assignedTo: currentUserDetails?.firstName || "Assigned to" }}
                                components={{ b: <b /> }}
                            />
                        </Text>
                    </List.Item>
                    <List.Item>
                        <Text>
                            <Trans
                                i18nKey={"task_category.tasks.recurrence"}
                                values={{ recurrenceRule: currentUserDetails?.firstName || "Recurrence" }}
                                components={{ b: <b /> }}
                            />
                        </Text>
                    </List.Item>
                    <List.Item>
                        <Text>
                            <Trans
                                i18nKey={"task_category.tasks.assigned_by"}
                                values={{ createdBy: currentUserDetails?.firstName || "Assigned By" }}
                                components={{ b: <b /> }}
                            />
                        </Text>
                    </List.Item>
                </List.Root>
            </Card.Body>
            <Card.Footer marginRight={"-10px"} marginBottom={"-10px"}>
                <Button width={"33%"} height={"50px"} border={"2px solid"}>
                    <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color="brand.900"
                        textAlign={isRTL ? "right" : "left"}
                    >
                        <Trans
                            i18nKey={"task_category.buttons.done"}
                            components={{ b: <b /> }}
                        />
                    </Text>
                </Button>
                <Button width={"33%"} height={"50px"} border={"2px solid"}>
                    <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color="brand.900"
                        textAlign={isRTL ? "right" : "left"}
                    >
                        <Trans
                            i18nKey={"task_category.buttons.postpone"}
                            components={{ b: <b /> }}
                        />
                    </Text>
                </Button>
                <Button width={"33%"} height={"50px"} border={"2px solid"}>
                    <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color="brand.900"
                        textAlign={isRTL ? "right" : "left"}
                    >
                        <Trans
                            i18nKey={"task_category.buttons.didnt_do"}
                            components={{ b: <b /> }}
                        />
                    </Text>
                </Button>
            </Card.Footer>
        </Card.Root>
    );
}