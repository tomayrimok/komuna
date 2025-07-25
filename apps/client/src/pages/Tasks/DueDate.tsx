import { HStack, Icon } from "@chakra-ui/react";
import { IconClock } from "@tabler/icons-react";
import { isToday, isPast as isDatePast, isFuture as isDateFuture, isTomorrow } from "../../utils/dateUtils";

interface DueDateProps {
    dueDate: Date;
}

const DueDate: React.FC<DueDateProps> = ({ dueDate }) => {
    const isPast = isDatePast(dueDate);
    const isFuture = isDateFuture(dueDate);
    const today = isToday(dueDate);
    const tomorrow = isTomorrow(dueDate);
    const formattedDateNoYear = dueDate.toLocaleDateString("he-IL", { month: 'short', day: 'numeric' });

    return (
        <HStack color={isPast ? 'red.500' : 'gray.500'} fontSize="sm" alignItems={'center'} gap={1}>
            <Icon size={"sm"}>
                <IconClock />
            </Icon>
            {today ? 'היום' : tomorrow ? 'מחר' : formattedDateNoYear}
        </HStack>
    );
}

export default DueDate;