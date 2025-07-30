import { Badge, Card, Flex, HStack, Icon, Tag, Text } from "@chakra-ui/react";
import { ContextType, Frequency, GeneralShoppingListResponseDto } from "@komuna/types";
import { IconCheck, IconClock, IconHome, IconShoppingCart, IconUser, IconX } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import DateText from "../../components/dateText";
import GeneralShoppingListCardTags from "./GeneralShoppingListCardTags";

interface GeneralShoppingListCardProps {
    list: GeneralShoppingListResponseDto;
}


const GeneralShoppingListCard = ({ list }: GeneralShoppingListCardProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();


    const handleViewItems = (list: GeneralShoppingListResponseDto) => {
        navigate({ to: `/roommate/general-shopping-lists/${list.generalShoppingListId}/items` });
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
                        {list.isActive ? t('shopping.general_lists.active') : t('shopping.general_lists.inactive')}
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
                        {list.items.length === 1 ? t('shopping.general_lists.one_item') : t('shopping.general_lists.items', { count: list.items.length })}
                    </Text>
                )}

                {list.lastGeneratedAt && (
                    <Text fontSize="sm" color="gray.500">
                        {t('shopping.general_lists.last_generation')}: <DateText date={list.lastGeneratedAt.toString()} />
                    </Text>
                )}

                {list.nextGenerationAt && list.isActive && !list.isManualOnly && (
                    <Text fontSize="sm" color="gray.500">
                        {t('shopping.general_lists.next_generation')}: <DateText date={list.nextGenerationAt.toString()} />
                    </Text>
                )}

                <GeneralShoppingListCardTags list={list} />

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