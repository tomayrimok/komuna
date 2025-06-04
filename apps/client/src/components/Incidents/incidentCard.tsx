import { Box, Card, Flex, Icon, Tag, Text } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { IconChevronLeft, IconMoneybag } from "@tabler/icons-react";
import { useLocaleChange } from "../../hooks/useLocaleChange";
import { roundUpToXDigits } from "../../utilities/roundUpToXDigits";
import { format, parseISO } from "date-fns";
import { Incident } from "libs/types/src/generated";
import { IncidentStatus, IncidentUrgency } from "@komuna/types";

interface IncidentCardProps {
    item: Incident;
}

const urgencyColors: Record<string, string> = {
    [IncidentUrgency.LOW]: "green.500",
    [IncidentUrgency.MEDIUM]: "yellow.500",
    [IncidentUrgency.HIGH]: "orange.600",
    [IncidentUrgency.EXTREME]: "red.700",
};
const statusColors: Record<string, string> = {
    [IncidentStatus.OPEN]: "blue.500",
    [IncidentStatus.IN_PROGRESS]: "yellow.500",
    [IncidentStatus.SOLVED]: "green.500",
};

const IncidentCard: React.FC<IncidentCardProps> = ({ item }) => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    // const { isRTL } = useLocaleChange();

    const month = format(parseISO(item.createdAt), 'M')
    const date = format(parseISO(item.createdAt), 'dd')
    const year = format(parseISO(item.createdAt), 'yyyy')

    return (

        <Card.Root
            onClick={() => navigate({ to: `/landlord/incident/${item.incidentId}` })}
            width="100%"
            key={item.incidentId}
        >
            <Card.Header gap={0}>

                <Flex direction={"row"} alignItems="center" gap={2} mb={2}>
                    <Box>
                        <Text fontSize="lg" fontWeight="bold">
                            {item.title}
                        </Text>
                        <Text color={"gray.500"}>
                            {item.description}
                        </Text>
                    </Box>
                    {/* <Tag.Root backgroundColor={urgencyColors[item.urgencyLevel]} color={"white"} borderRadius={"2xl"}>
                        {t(`urgency.${item.urgencyLevel}` as any)}
                    </Tag.Root> */}
                    <Tag.Root backgroundColor={statusColors[item.status]} color={"white"} borderRadius={"2xl"}>
                        {t(`status.${item.status}` as any)}
                    </Tag.Root>

                </Flex>


            </Card.Header>
            <Card.Description>

            </Card.Description>
            <Card.Footer>
                <Text fontSize="sm" direction={"l"} color={"gray.500"} ms={"auto"}>
                    {date} {t(`months.${month}` as any)} {year}
                </Text>
            </Card.Footer>
        </Card.Root >


    )
}

export default IncidentCard