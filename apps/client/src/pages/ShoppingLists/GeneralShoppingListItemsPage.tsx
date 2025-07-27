import { Button, Card, Flex, Heading, HStack, IconButton, Image, Loader, Text, VStack } from '@chakra-ui/react';
import { ApiTypes, ContextType } from '@komuna/types';
import {
    IconCopy,
    IconEdit,
    IconShoppingCart
} from '@tabler/icons-react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { Reorder } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toaster } from '../../chakra/ui/toaster';
import { SearchGroceryInput } from '../../components/ShoppingList/SearchGroceryInput';
import { ShoppingListItem } from '../../components/ShoppingList/shoppingListItem';
import { useShoppingList } from '../../context/auth/ShoppingListProvider';
import { useDeleteGeneralShoppingList, useDuplicateGeneralShoppingList, useManuallyGenerateFromTemplate } from '../../hooks/query/useGeneralShoppingLists';
import ApartmentLayout from '../NewApartment/ApartmentLayout';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/auth/AuthProvider';

interface ActionHandlers {
    onEditDetails: () => void;
    onDuplicate: () => void;
    onCopyToShoppingList: () => void;
    deleteMutation: { isPending: boolean };
    duplicateMutation: { isPending: boolean };
}

const GeneralShoppingListItemsContent: React.FC<ActionHandlers> = ({
    onEditDetails,
    onDuplicate,
    onCopyToShoppingList,
    deleteMutation,
    duplicateMutation
}) => {
    const { items, updateOrder, openEditDrawer, isFetching, handleAddItem, title } = useShoppingList();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleGrocerySelect = (item: ApiTypes.ShoppingListItemWithIdDto) => {
        const templateItem = {
            name: item.name,
            amount: item.amount,
            isUrgent: item.isUrgent || false,
            image: item.image,
            category: item.category,
        };
        handleAddItem(templateItem as any);
    };

    return (
        <ApartmentLayout
            boxProps={{ h: '100%' }}
            mt={0}
            goBack={() => navigate({ to: '/roommate/general-shopping-lists' })}
            borderRadius={"40px"}
            containerProps={{ pt: 8, h: '100%' }}
            h="100%"
        >
            <Flex flexDirection={'column'} h="100%" pb={20}>

                <Card.Root
                    p={4}
                    bg="white"
                    borderRadius={"20px"}
                >
                    <Flex justifyContent="space-between">
                        <Heading size="lg" mb={4}>{title}</Heading>
                        <IconButton
                            onClick={() => onEditDetails()}
                            color={'gray.500'}
                            variant={'ghost'}
                        >
                            <IconEdit />
                        </IconButton>
                    </Flex>
                    <HStack gap={2}>
                        <Button
                            onClick={onCopyToShoppingList}
                            size="sm"
                        >
                            <IconShoppingCart size={16} />
                            העתק לרשימה הפעילה
                        </Button>

                        <Button
                            onClick={onDuplicate}
                            size="sm"
                            loading={duplicateMutation.isPending}
                        >
                            <IconCopy size={16} />
                            שכפול
                        </Button>

                    </HStack>
                </Card.Root>
                <Flex my={4}>
                    <SearchGroceryInput handleAddItem={handleGrocerySelect} />
                </Flex>

                <Reorder.Group axis="y" values={items} onReorder={updateOrder}>
                    {items.map((item, index) => (
                        <Reorder.Item key={item.itemId} value={item}>
                            <ShoppingListItem
                                item={{
                                    ...item,
                                    isPurchased: false,
                                    createdAt: new Date().toISOString(),
                                    creatorId: '',
                                } as any}
                                openEditDrawer={(shoppingItem) => {
                                    const templateItem = {
                                        name: shoppingItem.name,
                                        amount: shoppingItem.amount,
                                        isUrgent: shoppingItem.isUrgent,
                                        category: shoppingItem.category,
                                        image: shoppingItem.image,
                                    };
                                    openEditDrawer(templateItem as any);
                                }}
                            />
                        </Reorder.Item>
                    ))}
                </Reorder.Group>

                {isFetching ? (
                    <Flex direction="column" align="center" justify="center" h="200px" color="gray.500">
                        <Loader />
                    </Flex>
                ) : (
                    items.length === 0 && (
                        <Flex direction="column" align="center" justify="center" color="brand.900" flexGrow={1}>
                            <Image src="/meerkats/shopping.png" width="50vw" />
                            <VStack gap="2">
                                <Text fontSize="lg" fontWeight="semibold">
                                    אין פריטים בתבנית
                                </Text>
                                <Text fontWeight="semibold">בואו נוסיף כמה פריטים!</Text>
                            </VStack>
                        </Flex>
                    )
                )}
            </Flex>
        </ApartmentLayout>
    );
};

const GeneralShoppingListItemsPage: React.FC = () => {
    const router = useRouter();
    const generalShoppingListId = router.state.location.pathname.split('/')[3];
    const navigate = useNavigate();
    const { setContextType } = useShoppingList();
    const { sessionDetails } = useAuth();
    const deleteMutation = useDeleteGeneralShoppingList();
    const duplicateMutation = useDuplicateGeneralShoppingList();
    const manuallyGenerateFromTemplateMutation = useManuallyGenerateFromTemplate();
    const queryClient = useQueryClient();
    const handleEditDetails = () => {
        navigate({
            to: '/roommate/general-shopping-lists/$generalShoppingListId',
            params: { generalShoppingListId: generalShoppingListId! }
        });
    };



    const handleDuplicate = async () => {
        try {
            await duplicateMutation.mutateAsync(generalShoppingListId!);
            toaster.create({
                title: 'הצלחה',
                description: 'תבנית רשימת הקניות שוכפלה בהצלחה',
                type: 'success',
            });
            navigate({ to: '/roommate/general-shopping-lists' });
        } catch (error) {
            toaster.create({
                title: 'שגיאה',
                description: 'שכפול תבנית רשימת הקניות נכשל',
                type: 'error',
            });
        }
    };

    const handleCopyToShoppingList = async () => {
        await manuallyGenerateFromTemplateMutation.mutateAsync({
            generalShoppingListId: generalShoppingListId!,
        });
    };

    if (!generalShoppingListId) {
        return (
            <Flex direction="column" align="center" justify="center" h="200px">
                <Text>תבנית רשימת הקניות לא נמצאה</Text>
            </Flex>
        );
    }

    return (
        <GeneralShoppingListItemsContent
            onEditDetails={handleEditDetails}
            onDuplicate={handleDuplicate}
            onCopyToShoppingList={handleCopyToShoppingList}
            deleteMutation={deleteMutation}
            duplicateMutation={duplicateMutation}
        />
    );
};

export default GeneralShoppingListItemsPage; 