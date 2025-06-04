import { IncidentUrgency } from "@komuna/types";
import { IconAlertCircle, IconChevronsDown, IconChevronsUp, IconChevronUp } from "@tabler/icons-react";

export const URGENCY_DATA = {
    [IncidentUrgency.LOW]: {
        backgroundColor: "green.200",
        color: "green.600",
        icon: <IconChevronsDown />,
        text: "urgency.LOW"
    },
    [IncidentUrgency.MEDIUM]: {
        backgroundColor: "yellow.200",
        color: "yellow.600",
        icon: <IconChevronUp />,
        text: "urgency.MEDIUM"
    },
    [IncidentUrgency.HIGH]: {
        backgroundColor: "red.200",
        color: "red.700",
        icon: <IconChevronsUp />,
        text: "urgency.HIGH"
    },
    [IncidentUrgency.EXTREME]: {
        backgroundColor: "red.500",
        color: "white",
        icon: <IconAlertCircle />,
        text: "urgency.EXTREME"
    }
};