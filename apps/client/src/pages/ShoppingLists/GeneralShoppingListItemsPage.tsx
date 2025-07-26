import { Flex, Image, Loader, Text, VStack, HStack, Button, Card } from '@chakra-ui/react';
import { Reorder } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate, useRouter } from '@tanstack/react-router';
import {
    IconEdit,
    IconTrash,
    IconCopy,
    IconShoppingCart
} from '@tabler/icons-react';
import { ApiTypes } from '@komuna/types';
import { useDeleteGeneralShoppingList, useDuplicateGeneralShoppingList } from '../../hooks/query/useGeneralShoppingLists';
import { toaster } from '../../chakra/ui/toaster';
import { SearchGroceryInput } from '../../components/ShoppingList/SearchGroceryInput';
import { ShoppingListItem } from '../../components/ShoppingList/shoppingListItem';
import { GeneralShoppingListProvider, useGeneralShoppingList } from '../../context/auth/GeneralShoppingListProvider';

interface ActionHandlers {
    onEditDetails: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onCopyToShoppingList: () => void;
    deleteMutation: { isPending: boolean };
    duplicateMutation: { isPending: boolean };
}

const GeneralShoppingListItemsContent: React.FC<ActionHandlers> = ({
    onEditDetails,
    onDelete,
    onDuplicate,
    onCopyToShoppingList,
    deleteMutation,
    duplicateMutation
}) => {
    const { items, updateOrder, openEditDrawer, isFetching, handleAddItem } = useGeneralShoppingList();
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
        <>
            <Flex p={4} flexDirection={'column'} py={4} h="100%" pb={20}>
                <Flex mb={4}>
                    <SearchGroceryInput handleAddItem={handleGrocerySelect} />
                </Flex>

                <Reorder.Group axis="y" values={items} onReorder={updateOrder}>
                    {items.map((item, index) => (
                        <Reorder.Item key={index} value={item}>
                            <ShoppingListItem
                                item={{
                                    ...item,
                                    itemId: index.toString(),
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

            <Card.Root
                position="fixed"
                bottom={0}
                left={0}
                right={0}
                p={4}
                bg="white"
                borderTop="1px solid"
                borderColor="border"
                borderRadius="16px 16px 0 0"
                zIndex={10}
            >
                <HStack gap={2} justifyContent="space-between">
                    <Button onClick={onEditDetails} variant="outline" size="sm" flex={1}>
                        <IconEdit size={16} />
                        עריכת פרטים
                    </Button>
                    <Button
                        onClick={onDuplicate}
                        variant="outline"
                        size="sm"
                        flex={1}
                        loading={duplicateMutation.isPending}
                    >
                        <IconCopy size={16} />
                        שכפול
                    </Button>
                    <Button
                        onClick={onCopyToShoppingList}
                        variant="solid"
                        size="sm"
                        flex={1}
                        colorPalette="blue"
                    >
                        <IconShoppingCart size={16} />
                        העתק לרשימה
                    </Button>
                    <Button
                        onClick={onDelete}
                        variant="outline"
                        size="sm"
                        colorPalette="red"
                        loading={deleteMutation.isPending}
                    >
                        <IconTrash size={16} />
                        מחק
                    </Button>
                </HStack>
            </Card.Root>
        </>
    );
};

const GeneralShoppingListItemsPage: React.FC = () => {
    const router = useRouter();
    const generalShoppingListId = router.state.location.pathname.split('/')[3];
    const navigate = useNavigate();

    const deleteMutation = useDeleteGeneralShoppingList();
    const duplicateMutation = useDuplicateGeneralShoppingList();

    const handleEditDetails = () => {
        navigate({
            to: '/roommate/general-shopping-lists/$generalShoppingListId',
            params: { generalShoppingListId: generalShoppingListId! }
        });
    };

    const handleDelete = async () => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק את תבנית רשימת הקניות?')) {
            try {
                await deleteMutation.mutateAsync(generalShoppingListId!);
                toaster.create({
                    title: 'הצלחה',
                    description: 'תבנית רשימת הקניות נמחקה בהצלחה',
                    type: 'success',
                });
                navigate({ to: '/roommate/general-shopping-lists' });
            } catch (error) {
                toaster.create({
                    title: 'שגיאה',
                    description: 'מחיקת תבנית רשימת הקניות נכשלה',
                    type: 'error',
                });
            }
        }
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

    const handleCopyToShoppingList = () => {
        toaster.create({
            title: 'הצלחה',
            description: 'הפריטים הועתקו לרשימת קניות חדשה',
            type: 'success',
        });
        navigate({ to: '/roommate/shopping' });
    };

    if (!generalShoppingListId) {
        return (
            <Flex direction="column" align="center" justify="center" h="200px">
                <Text>תבנית רשימת הקניות לא נמצאה</Text>
            </Flex>
        );
    }

    return (
        <GeneralShoppingListProvider generalShoppingListId={generalShoppingListId}>
            <GeneralShoppingListItemsContent
                onEditDetails={handleEditDetails}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onCopyToShoppingList={handleCopyToShoppingList}
                deleteMutation={deleteMutation}
                duplicateMutation={duplicateMutation}
            />
        </GeneralShoppingListProvider>
    );
};

export default GeneralShoppingListItemsPage; 