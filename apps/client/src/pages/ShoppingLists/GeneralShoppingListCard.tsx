import { Badge, Card, Flex, HStack, Icon, Tag, Text } from "@chakra-ui/react";
import { ContextType, Frequency, GeneralShoppingListResponseDto } from "@komuna/types";
import { IconCheck, IconClock, IconHome, IconShoppingCart, IconUser, IconX } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import DateText from "../../components/dateText";

interface GeneralShoppingListCardProps {
    list: GeneralShoppingListResponseDto;
}

const frequencyText = {
    [Frequency.DAILY]: { one: 'כל יום', two: 'כל יומיים', many: 'כל $ ימים' },
    [Frequency.MONTHLY]: { one: 'כל חודש', two: 'כל חודשיים', many: 'כל $ חודשים' },
    [Frequency.WEEKLY]: { one: 'כל שבוע', two: 'כל שבועיים', many: 'כל $ שבועות' },
    [Frequency.YEARLY]: { one: 'כל שנה', two: 'כל שנתיים', many: 'כל $ שנים' }
}

const GeneralShoppingListCard = ({ list }: GeneralShoppingListCardProps) => {
    const navigate = useNavigate();

    const handleViewItems = (list: GeneralShoppingListResponseDto) => {
        navigate({ to: `/roommate/general-shopping-lists/${list.generalShoppingListId}/items` });
    };

    const getFrequencyText = (frequency: Frequency, interval?: number) => {
        return frequencyText[frequency][interval === 1 ? 'one' : interval === 2 ? 'two' : 'many'].replace('$', interval?.toString() || '');
    };

    const getContextText = (contextType: ContextType) => {
        return contextType === ContextType.APARTMENT ? 'רשימה משותפת' : 'רשימה אישית';
    };

    const getContextColor = (contextType: ContextType) => {
        return contextType === ContextType.APARTMENT ? 'blue' : 'purple';
    };

    return (
        <Card.Root key={list.generalShoppingListId} onClick={() => handleViewItems(list)} cursor={'pointer'}>
            <Card.Header>
                <HStack justifyContent={'space-between'}>
                    <Text fontSize="lg" fontWeight="semibold">
                        {list.title}
                    </Text>
                    <Badge colorPalette={list.isActive ? 'green' : 'gray'}>
                        {list.isActive ? <IconCheck size={16} /> : <IconX size={16} />}
                        {list.isActive ? 'פעילה' : 'לא פעילה'}
                    </Badge>
                </HStack>
            </Card.Header>
            <Card.Body pt={2}>

                {list.description && (
                    <Text whiteSpace={'pre-wrap'} lineHeight={1.2} fontSize="sm" color="gray.500" lineClamp={2} mb={2}>
                        {list.description}
                    </Text>
                )}

                {list.items && list.items.length > 0 && (
                    <Text fontSize="sm" color="gray.500" mb={2}>
                        {list.items.length} פריטים
                    </Text>
                )}

                {list.lastGeneratedAt && (
                    <Text fontSize="sm" color="gray.500">
                        ההפעלה האחרונה: <DateText date={list.lastGeneratedAt.toString()} />
                    </Text>
                )}

                {list.nextGenerationAt && list.isActive && !list.isManualOnly && (
                    <Text fontSize="sm" color="gray.500">
                        ההפעלה הבאה: <DateText date={list.nextGenerationAt.toString()} />
                    </Text>
                )}

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
                                {list.isManualOnly ? 'תבנית ידנית' : 'תבנית אוטומטית'}
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

                <Flex fontSize="sm" color="gray.500" alignItems={'center'} gap={1} mt={2}>
                    <Icon size={'sm'}>
                        <IconUser />
                    </Icon>
                    {list.createdBy.firstName} {list.createdBy.lastName}
                </Flex>

            </Card.Body>
        </Card.Root >
    )
}

export default GeneralShoppingListCard; 