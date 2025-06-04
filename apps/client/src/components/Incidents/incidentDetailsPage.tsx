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
import { IncidentUrgency } from "@komuna/types";

const IncidentDetailsPage = () => {
    const {
        incidentDetails,
        handleSave,
        incidentId,
        isIncidentDetailsLoading,
        isAddEditIncidentLoading,
        updateIncidentDetails
    } = useIncident();

    const router = useRouter();
    const { t } = useTranslation();

    const buttonDisabled = !incidentDetails?.title || !incidentDetails.description || isIncidentDetailsLoading || isAddEditIncidentLoading;

    const urgencyLevels = createListCollection({
        items: [
            { value: IncidentUrgency.LOW, label: t("urgency.LOW"), color: "green.500" },
            { value: IncidentUrgency.MEDIUM, label: t("urgency.MEDIUM"), color: "yellow.500" },
            { value: IncidentUrgency.HIGH, label: t("urgency.HIGH"), color: "red.500" },
            { value: IncidentUrgency.EXTREME, label: t("urgency.EXTREME"), color: "red.700" }
        ]
    });

    if (incidentId && isIncidentDetailsLoading) return <Text>Loading...</Text>;

    return (
        <Container maxW="lg" p={8}>
            <Stack gap={6}>
                <Heading size="lg" textAlign="center">
                    {incidentId ? t("incidents.edit_incident") : t("incidents.create_incident")}
                </Heading>

                <Box p={4} borderWidth={1} borderRadius="xl" bg="white">
                    <Stack gap={4}>
                        <Box>
                            <Text mb={1} fontWeight="bold">
                                {t("incidents.incident_title")}
                            </Text>
                            <Input
                                fontSize={"lg"}
                                value={incidentDetails?.title || ''}
                                onChange={(e) => updateIncidentDetails({ title: e.target.value })}
                                variant={"flushed"}
                            />
                        </Box>
                        <Box>
                            <Text mb={1} fontWeight="bold">
                                {t("incidents.incident_description")}
                            </Text>
                            <Textarea
                                fontSize={"lg"}
                                value={incidentDetails?.description || ''}
                                resize={"none"}
                                onChange={(e) => updateIncidentDetails({ description: e.target.value })}
                                variant={"flushed"}
                                alignContent={"end"}
                            />
                        </Box>
                        <Box>
                            <Text mb={1} fontWeight="bold">
                                {t("incidents.urgency_level")}
                            </Text>
                            <Select.Root
                                collection={urgencyLevels}
                                value={[incidentDetails?.urgencyLevel || IncidentUrgency.MEDIUM]}
                                onValueChange={(e) => updateIncidentDetails({ urgencyLevel: e.value[0] as IncidentUrgency })}
                            >
                                {/* <Select.HiddenSelect /> */}
                                <Select.Control>
                                    <Select.Trigger>
                                        <Flex alignItems="center" gap={2}>
                                            <Box backgroundColor={incidentDetails?.urgencyLevel ? urgencyLevels.find(incidentDetails.urgencyLevel)?.color : "yellow.500"} borderRadius="full" h={4} w={4} />

                                            <Select.ValueText placeholder="Select framework" />
                                        </Flex>
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {urgencyLevels.items.map((urgency) => (
                                                <Select.Item item={urgency} key={urgency.value}>
                                                    <Flex alignItems={"center"} gap={2}>
                                                        <Box backgroundColor={urgency.color} borderRadius="full" h={4} w={4} />
                                                        {urgency.label}
                                                    </Flex>
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                        </Box>


                    </Stack>
                    <Flex justifyContent="space-between" gap={3}>
                        <Button variant="outline" onClick={() => router.history.back()} size={"lg"}>
                            {t("cancel")}
                        </Button>
                        <Button colorScheme="blue" onClick={handleSave} disabled={buttonDisabled} size={"lg"}>
                            {t("save")}
                        </Button>
                        {/* {expenseId &&
                        <Button colorScheme="red" variant="ghost" onClick={handleDelete}>
                            מחיקת הוצאה
                        </Button>
                    } */}
                    </Flex>
                </Box>

            </Stack>
        </Container >
    );
};

export default withWrappers(IncidentDetailsPage, [IncidentProvider]);
