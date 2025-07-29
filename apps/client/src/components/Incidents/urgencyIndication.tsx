import { Box } from '@chakra-ui/react';
import { IncidentResponseDto } from 'libs/types/src/generated';
import { useLocaleChange } from '../../hooks/useLocaleChange';
import { IncidentStatus, IncidentUrgency } from '@komuna/types';

interface UrgencyIndicationProps {
  item: IncidentResponseDto;
}

const UrgencyIndication: React.FC<UrgencyIndicationProps> = ({ item }) => {
  const { isRTL } = useLocaleChange();

  const colors = {
    [IncidentUrgency.LOW]: 'green.400',
    [IncidentUrgency.MEDIUM]: 'yellow.400',
    [IncidentUrgency.HIGH]: 'red.400',
    [IncidentUrgency.EXTREME]: 'red.700',
  };

  const color = item.status === IncidentStatus.SOLVED ? 'gray.100' : colors[item.urgencyLevel];

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

export default UrgencyIndication;
