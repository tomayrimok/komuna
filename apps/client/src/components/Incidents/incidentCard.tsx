import { Box, Card, Container, Flex, Icon, Tag, Text } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { IconAlertCircle, IconArrowsDown, IconArrowsTransferDown, IconBrandMedium, IconCheck, IconChevronDown, IconChevronLeft, IconChevronsDown, IconChevronsUp, IconChevronUp, IconClock, IconEqual, IconMessage, IconMessage2, IconMessage2Bolt, IconMessage2Down, IconMessageFilled, IconMinus, IconMoneybag, IconStar, IconUser } from "@tabler/icons-react";
import { useLocaleChange } from "../../hooks/useLocaleChange";
import { roundUpToXDigits } from "../../utilities/roundUpToXDigits";
import { format, parseISO } from "date-fns";
import { Incident, IncidentResponseDto } from "libs/types/src/generated";
import { IncidentStatus, IncidentUrgency } from "@komuna/types";
import IncidentTag from "./incidentTag";
import { STATUSES_DATA } from "./consts/statuses.data";
import { URGENCY_DATA } from "./consts/urgency.data";
import DateText from "../dateText";
import NumberOfComments from "./numberOfComments";
import UrgencyIndication from "./urgencyIndication";

interface IncidentCardProps {
    item: IncidentResponseDto;
}


const IncidentCard: React.FC<IncidentCardProps> = ({ item }) => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isRTL } = useLocaleChange();

    const numberOfComments = item.comments?.length || 0;


    return (

        <Box
            backgroundColor={"white"}
            borderWidth={1}
            borderRadius={"xl"}
            onClick={() => navigate({ to: `/landlord/incident/${item.incidentId}` })}
            width="100%"
            key={item.incidentId}
            position={"relative"}
            overflow={"hidden"}
            ps={"10px"}
        >
            <UrgencyIndication item={item} />

            <Container p={5}>

                <Flex direction={"column"} gap={2} mb={2}>
                    <Text fontSize="lg" fontWeight="bold">
                        {item.title}
                    </Text>
                    {item.description &&
                        <Text color={"gray.500"} whiteSpace={"pre-wrap"} lineHeight={1.2}>
                            {item.description}
                        </Text>
                    }
                    <Flex mt={2} gap={2}>
                        <IncidentTag value={item.status} data={STATUSES_DATA} />
                        {numberOfComments ? <NumberOfComments number={numberOfComments} /> : null}
                        {/* <IncidentTag value={item.urgencyLevel} data={URGENCY_DATA} /> */}
                    </Flex>

                </Flex>


            </Container>

            <hr />
            <Container p={5}>

                <Flex direction={"row"} justifyContent={"space-between"} w="full">
                    <Flex fontSize="sm" color="gray.500" alignItems={"center"} gap={1}>
                        <Icon size={"sm"}>
                            <IconUser />
                        </Icon>
                        {item.reporter.firstName} {item.reporter.lastName}
                    </Flex>
                    <Text fontSize="sm" direction={"l"} color={"gray.500"}>
                        <DateText date={item.createdAt} />
                    </Text>
                </Flex>
            </Container>
        </Box >


    )
}

export default IncidentCard