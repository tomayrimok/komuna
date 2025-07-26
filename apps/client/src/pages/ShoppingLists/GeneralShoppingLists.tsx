import {
    Box,
    Button,
    Flex,
    Image,
    Loader,
    Stack,
    Text,
    VStack
} from '@chakra-ui/react';
import { IconPlayerPlay, IconShoppingCart } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toaster } from '../../chakra/ui/toaster';
import { BackNavigationBar } from '../../components/BackNavigationBar';
import MainButton from '../../components/mainButton';
import {
    useDeleteGeneralShoppingList,
    useGeneralShoppingLists,
    useManuallyGenerateFromTemplate
} from '../../hooks/query/useGeneralShoppingLists';
import GeneralShoppingListCard from './GeneralShoppingListCard';

const GeneralShoppingLists: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data: generalShoppingLists, isLoading, error } = useGeneralShoppingLists();

    const deleteMutation = useDeleteGeneralShoppingList();
    const generateMutation = useManuallyGenerateFromTemplate();

    const handleCreateTemplate = () => {
        navigate({ to: '/roommate/general-shopping-lists/create' });
    };

    const handleDelete = async (listId: string) => {
        try {
            await deleteMutation.mutateAsync(listId);
            toaster.create({
                title: 'Success',
                description: 'תבנית רשימת קניות נמחקה בהצלחה',
                type: 'success',
            });
        } catch (error) {
            toaster.create({
                title: 'Error',
                description: 'שגיאה במחיקת תבנית רשימת קניות',
                type: 'error',
            });
        }
    };

    const handleGenerateLists = async () => {
        try {
            // Generate from all active automatic templates (for demonstration)
            // In practice, you might want to generate from specific templates or let the server handle this
            const activeLists = generalShoppingLists?.filter(list => list.isActive && !list.isManualOnly) || [];

            for (const list of activeLists) {
                await generateMutation.mutateAsync({
                    generalShoppingListId: list.generalShoppingListId
                });
            }

            toaster.create({
                title: 'Success',
                description: 'רשימות קניות נוצרו בהצלחה מהתבניות',
                type: 'success',
            });
        } catch (error) {
            toaster.create({
                title: 'Error',
                description: 'שגיאה ביצירת רשימות קניות',
                type: 'error',
            });
        }
    };

    // Sort lists to show active ones first, then by creation date
    const sortedLists = generalShoppingLists?.sort((a, b) => {
        if (a.isActive !== b.isActive) {
            return a.isActive ? -1 : 1;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (isLoading) {
        return (
            <Box h="full" display="flex" alignItems="center" justifyContent="center">
                <Loader />
            </Box>
        );
    }

    if (error) {
        return (
            <Box h="full" p={6}>
                <BackNavigationBar />
                <Flex flexDirection="column" alignItems="center" justifyContent="center" mt="20vh">
                    <Text fontSize="xl" color="red.500">
                        שגיאה בטעינת תבניות רשימות קניות
                    </Text>
                </Flex>
            </Box>
        );
    }

    return (
        <Box h="full">
            <BackNavigationBar />
            <Box p={6} pb={12}>
                <VStack alignItems="start" gap="4" mb={6}>
                    <Text fontSize="2xl" fontWeight="bold">
                        תבניות רשימות קניות
                    </Text>
                    {generalShoppingLists?.length ? (
                        <Button
                            onClick={handleGenerateLists}
                            variant="subtle"
                            loading={generateMutation.isPending}
                        >
                            <IconPlayerPlay size={16} />
                            יצירת רשימות חדשות כעת
                        </Button>
                    ) : null}
                </VStack>

                <Stack gap="4">
                    {sortedLists?.map((list) => (
                        <GeneralShoppingListCard key={list.generalShoppingListId} list={list} />
                    ))}

                    {(!generalShoppingLists || generalShoppingLists.length === 0) && (
                        <Flex flexDirection="column" alignItems="center" justifyContent="center" mt="22vh">
                            <Image src="/meerkats/shopping.png" height={'30vh'} />
                            <Text fontSize="xl" fontWeight="bold" mb={2}>
                                אין תבניות רשימות קניות זמינות
                            </Text>
                            <Text fontSize="md" color="gray.500" textAlign="center" px={4}>
                                צרו תבניות לרשימות קניות שחוזרות על עצמן או לשימוש ידני
                            </Text>
                        </Flex>
                    )}
                </Stack>
            </Box>
            <MainButton
                onClick={handleCreateTemplate}
            >
                <IconShoppingCart size={16} />
                יצירת תבנית רשימת קניות
            </MainButton>
        </Box>
    );
};

export default GeneralShoppingLists; 