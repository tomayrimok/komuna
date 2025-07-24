import { Icon, Tag } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface IncidentTagProps<T extends string> {
  value: T;
  data: Record<T, { backgroundColor: string; color: string; icon: React.ReactNode; text: string }>;
}

function IncidentTag<const T extends string>({ value, data }: IncidentTagProps<T>) {
  const { t } = useTranslation();

  return (
    <Tag.Root ring={0} backgroundColor={data[value].backgroundColor} color={data[value].color} borderRadius="2xl" h="fit-content">
      <Icon boxSize="3">{data[value].icon}</Icon>
      <Tag.Label>{t(data[value].text as any)}</Tag.Label>
    </Tag.Root>
  );
}

export default IncidentTag;
