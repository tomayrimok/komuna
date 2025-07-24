import { HStack, Icon } from "@chakra-ui/react";
import { IconClock } from "@tabler/icons-react";

interface DueDateProps {
    dueDate: Date;
}

const DueDate: React.FC<DueDateProps> = ({ dueDate }) => {

    const today = new Date();
    const isFuture = dueDate > today;
    const isPast = dueDate < today;
    const formattedDateNoYear = dueDate.toLocaleDateString("he-IL", { month: 'short', day: 'numeric' });

    return (
        <HStack color={isPast ? 'red.500' : 'gray.500'} fontSize="sm" alignItems={'center'} gap={1}>
            <Icon size={"sm"}>
                <IconClock />
            </Icon>
            {isFuture || isPast ? formattedDateNoYear : 'היום'}
        </HStack>
    );
}

export default DueDate;