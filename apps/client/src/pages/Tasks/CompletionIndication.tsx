import { Box } from '@chakra-ui/react';
import { TaskResponseDto } from 'libs/types/src/generated';
import { useLocaleChange } from '../../hooks/useLocaleChange';
import { getTaskCompleted } from '../../utilities/getTaskCompleted';
import { getTodayDateOnly } from '../../utils/dateUtils';

interface CompletionIndicationProps {
    item: TaskResponseDto;
}

const CompletionIndication: React.FC<CompletionIndicationProps> = ({ item }) => {
    const { isRTL } = useLocaleChange();

    const isCompleted = getTaskCompleted(item);
    const today = getTodayDateOnly();
    const isPassed = item.dueDate && new Date(item.dueDate) < today;
    const isToday = item.dueDate && new Date(item.dueDate).toDateString() === today.toDateString();

    const color = isCompleted ? "green.400" : isPassed ? "red.700" : isToday ? "yellow.400" : "gray.400"

    return (
        <Box
            position={'absolute'}
            backgroundColor={color}
            height={'full'}
            width={'7px'}
            {...(isRTL ? { right: 0 } : { left: 0 })}
        />
    );
};

export default CompletionIndication;
