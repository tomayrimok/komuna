import { IncidentStatus } from "@komuna/types";
import { IconAlertCircle, IconCheck, IconClock } from "@tabler/icons-react";

export const STATUSES_DATA = {
    [IncidentStatus.OPEN]: {
        backgroundColor: "red.200",
        color: "red.700",
        icon: <IconAlertCircle />,
        text: `status.OPEN`
    },
    [IncidentStatus.IN_PROGRESS]: {
        backgroundColor: "yellow.200",
        color: "yellow.600",
        icon: <IconClock />,
        text: `status.IN_PROGRESS`
    },
    [IncidentStatus.SOLVED]: {
        backgroundColor: "green.200",
        color: "green.600",
        icon: <IconCheck />,
        text: `status.SOLVED`
    }
};

export const INCIDENT_STATUSES = Object.entries(STATUSES_DATA).map(([key, value]) => ({
    value: key as IncidentStatus,
    ...value
}));