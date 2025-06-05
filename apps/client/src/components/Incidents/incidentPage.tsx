import {
    Box,
    Button,
    Container,
    createListCollection,
    Flex,
    Heading,
    Input,
    NumberInput,
    Portal,
    Select,
    Stack,
    Text,
    Textarea
} from "@chakra-ui/react";
import { ExpenseProvider, useExpense } from "../../context/payments/ExpenseProvider";
import { withWrappers } from "../../utilities/withWrappers";
import { useRouter } from "@tanstack/react-router";
import SelectUserDrawer from "../General/selectResidentDrawer";
import { useTranslation } from "react-i18next";
import { IncidentProvider, useIncident } from "../../context/incidents/IncidentProvider";
import { IncidentStatus, IncidentUrgency } from "@komuna/types";
import IncidentTag from "./incidentTag";
import { URGENCY_DATA } from "./consts/urgency.data";
import { INCIDENT_STATUSES, STATUSES_DATA } from "./consts/statuses.data";
import { IconSend, IconSend2 } from "@tabler/icons-react";
import { useIsRTL } from "../../hooks/useIsRTL";

const IncidentPage = () => {
    const {
        incidentDetails,
        handleSave,
        incidentId,
        isIncidentDetailsLoading,
        isAddEditIncidentLoading,
        updateIncidentDetails,
        addComment,
        newComment,
        setNewComment
    } = useIncident();

    const { t } = useTranslation();

    const { isRTL } = useIsRTL();
    console.log('isRTL :', isRTL);

    if (!incidentDetails) return <Text>Loading...</Text>;


    return (
        <Container maxW="lg" p={8}>
            <Stack gap={6}>


                <Box p={4} borderWidth={1} borderRadius="xl" bg="white">
                    <Text fontSize="xl" fontWeight="bold">
                        {incidentDetails?.title}
                    </Text>
                    <Text>
                        {incidentDetails?.description}
                    </Text>
                    <IncidentTag value={incidentDetails?.status} data={STATUSES_DATA} />
                    <IncidentTag value={incidentDetails?.urgencyLevel} data={URGENCY_DATA} />
                </Box>
                <Box p={4} borderWidth={1} borderRadius="xl" bg="white">
                    <Text fontSize="lg" fontWeight="bold">
                        עדכון סטטוס
                    </Text>
                    <Flex gap={2} mt={3}>
                        {INCIDENT_STATUSES.map((status) => (
                            <Button
                                key={status.value}
                                onClick={() => updateIncidentDetails({ status: status.value as IncidentStatus })}
                                backgroundColor={incidentDetails.status === status.value ? status.backgroundColor : "gray.100"}
                                color={incidentDetails.status === status.value ? status.color : "gray.600"}
                                py={0}
                                px={4}
                            >
                                {t(status.text as any)}
                            </Button>
                        ))}
                    </Flex>
                </Box>
                <Box p={4} borderWidth={1} borderRadius="xl" bg="white">
                    <Text fontSize="lg" fontWeight="bold">
                        הערות ועדכונים
                    </Text>
                    {incidentDetails?.comments?.map((comment, index) => (
                        <Box key={index} p={3} borderWidth={1} borderRadius="md" bg="gray.50" mt={2}>
                            <Text fontWeight="bold">{comment.message}</Text>
                            <Text>{comment.createdAt}</Text>
                        </Box>
                    ))}
                    <Flex alignItems={"center"} gap={2}>
                        <Input
                            placeholder="הוסף הערה..."
                            onChange={(e) => setNewComment(e.target.value)}
                            value={newComment || ''}
                        />
                        <Button colorScheme="blue" onClick={addComment}>
                            <IconSend2 style={{ transform: isRTL ? "scaleX(-1)" : "" }} />
                        </Button>

                    </Flex>
                </Box>

            </Stack>
        </Container >
    );
};

export default withWrappers(IncidentPage, [IncidentProvider]);
