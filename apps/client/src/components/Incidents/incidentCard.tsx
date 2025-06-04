import { Box, Card, Flex, Icon, Tag, Text } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { IconAlertCircle, IconArrowsDown, IconArrowsTransferDown, IconBrandMedium, IconCheck, IconChevronDown, IconChevronLeft, IconChevronsDown, IconChevronsUp, IconChevronUp, IconClock, IconEqual, IconMinus, IconMoneybag, IconStar } from "@tabler/icons-react";
import { useLocaleChange } from "../../hooks/useLocaleChange";
import { roundUpToXDigits } from "../../utilities/roundUpToXDigits";
import { format, parseISO } from "date-fns";
import { Incident } from "libs/types/src/generated";
import { IncidentStatus, IncidentUrgency } from "@komuna/types";
import IncidentTag from "./incidentTag";
import { STATUSES_DATA } from "./consts/statuses.data";
import { URGENCY_DATA } from "./consts/urgency.data";

interface IncidentCardProps {
    item: Incident;
}


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
                        <Flex mt={2} gap={2}>
                            <IncidentTag value={item.status} data={STATUSES_DATA} />
                            <IncidentTag value={item.urgencyLevel} data={URGENCY_DATA} />
                        </Flex>
                    </Box>

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