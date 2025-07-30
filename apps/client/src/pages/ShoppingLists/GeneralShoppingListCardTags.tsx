import { ContextType, Frequency, GeneralShoppingListResponseDto } from "@komuna/types";
import { HStack, Tag } from "@chakra-ui/react";
import { IconHome, IconUser } from "@tabler/icons-react";
import { Text } from "@chakra-ui/react";
import { IconShoppingCart, IconClock } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface GeneralShoppingListCardTagsProps {
    list: GeneralShoppingListResponseDto;
}

const GeneralShoppingListCardTags = ({ list }: GeneralShoppingListCardTagsProps) => {

    const { t } = useTranslation();

    const getFrequencyText = (frequency: Frequency, interval?: number) => {
        const key = interval === 1 ? 'one' : interval === 2 ? 'two' : 'many';
        return t(`shopping.frequency.${frequency.toLowerCase()}.${key}`, { count: interval?.toString() || '0' } as any);
    };

    const getContextText = (contextType: ContextType) => {
        return contextType === ContextType.APARTMENT ? t('shopping.general_lists.shared_list') : t('shopping.general_lists.personal_list');
    };

    const getContextColor = (contextType: ContextType) => {
        return contextType === ContextType.APARTMENT ? 'yellow' : 'purple';
    };

    return (
        <HStack gap={2} mt={2} wrap="wrap">
            {/* Context Type Tag */}
            <Tag.Root colorPalette={getContextColor(list.targetContextType)} variant="subtle" w="fit-content" borderRadius="full">
                <Tag.Label display={'flex'} alignItems={'center'} gap={1}>
                    {list.targetContextType === ContextType.APARTMENT ? <IconHome size={16} /> : <IconUser size={16} />}
                    <Text fontSize="sm">
                        {getContextText(list.targetContextType)}
                    </Text>
                </Tag.Label>
            </Tag.Root>

            {/* Manual vs Automatic Tag */}
            <Tag.Root colorPalette={list.isManualOnly ? 'gray' : 'green'} variant="subtle" w="fit-content" borderRadius="full">
                <Tag.Label display={'flex'} alignItems={'center'} gap={1}>
                    <IconShoppingCart size={16} />
                    <Text fontSize="sm">
                        {list.isManualOnly ? t('shopping.general_lists.manual_template') : t('shopping.general_lists.automatic_template')}
                    </Text>
                </Tag.Label>
            </Tag.Root>

            {/* Frequency Tag for automatic templates */}
            {!list.isManualOnly && list.recurrenceRule && (
                <Tag.Root colorPalette="blue" variant="subtle" w="fit-content" borderRadius="full">
                    <Tag.Label display={'flex'} alignItems={'center'} gap={1}>
                        <IconClock size={16} />
                        <Text fontSize="sm">
                            {getFrequencyText(list.recurrenceRule.frequency as Frequency, list.recurrenceRule.interval)}
                        </Text>
                    </Tag.Label>
                </Tag.Root>
            )}
        </HStack>
    );
};

export default GeneralShoppingListCardTags; 