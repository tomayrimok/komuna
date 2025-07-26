import { Badge, Card, HStack, Text, Flex, Icon, Tag, Button } from "@chakra-ui/react"
import { GeneralShoppingListResponseDto, Frequency, ContextType } from "@komuna/types";
import { useNavigate } from "@tanstack/react-router";
import { IconClock, IconCheck, IconX, IconUser, IconShoppingCart, IconHome, IconPlayerPlay, IconEdit } from "@tabler/icons-react";
import DateText from "../../components/dateText";
import { useManuallyGenerateFromTemplate } from "../../hooks/query/useGeneralShoppingLists";
import { toaster } from "../../chakra/ui/toaster";

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
    const generateMutation = useManuallyGenerateFromTemplate();

    const handleViewItems = (list: GeneralShoppingListResponseDto) => {
        navigate({ to: `/roommate/general-shopping-lists/${list.generalShoppingListId}/items` });
    };

    const handleEditList = (list: GeneralShoppingListResponseDto) => {
        navigate({ to: `/roommate/general-shopping-lists/${list.generalShoppingListId}` });
    };

    const handleGenerateNow = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await generateMutation.mutateAsync({
                generalShoppingListId: list.generalShoppingListId
            });
            toaster.create({
                title: 'הצלחה',
                description: `רשימת קניות נוצרה מתבנית "${list.title}"`,
                type: 'success',
            });
        } catch (error) {
            toaster.create({
                title: 'שגיאה',
                description: 'יצירת רשימת קניות נכשלה',
                type: 'error',
            });
        }
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
                    <HStack gap={2}>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditList(list);
                            }}
                        >
                            <IconEdit size={14} />
                            עריכה
                        </Button>
                        {list.isActive && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleGenerateNow}
                                loading={generateMutation.isPending}
                            >
                                <IconPlayerPlay size={14} />
                                יצור כעת
                            </Button>
                        )}
                        <Badge colorPalette={list.isActive ? 'green' : 'gray'}>
                            {list.isActive ? <IconCheck size={16} /> : <IconX size={16} />}
                            {list.isActive ? 'פעילה' : 'לא פעילה'}
                        </Badge>
                    </HStack>
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
                        פריטים: {list.items.length}
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