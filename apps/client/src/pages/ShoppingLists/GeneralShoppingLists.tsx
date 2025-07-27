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
import ApartmentLayout from '../NewApartment/ApartmentLayout';

const GeneralShoppingLists: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data: generalShoppingLists, isLoading, error } = useGeneralShoppingLists();


    const handleCreateTemplate = () => {
        navigate({ to: '/roommate/general-shopping-lists/create' });
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
            <ApartmentLayout
                title="תבניות רשימות קניות"
                mt={0}
                goBack={() => navigate({ to: '/roommate' })}
                borderRadius={"40px"}
                containerProps={{ pt: 8 }}
            >
                <Flex flexDirection="column" alignItems="center" justifyContent="center" mt="20vh">
                    <Text fontSize="xl" color="red.500">
                        שגיאה בטעינת תבניות רשימות קניות
                    </Text>
                </Flex>
            </ApartmentLayout>
        );
    }

    return (
        <ApartmentLayout
            title="תבניות רשימות קניות"
            mt={0}
            goBack={() => navigate({ to: '/roommate' })}
            borderRadius={"40px"}
            containerProps={{ pt: 8 }}
        >
            <Box pb={12}>

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
        </ApartmentLayout>
    );
};

export default GeneralShoppingLists; 