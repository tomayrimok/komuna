import {
    Box,
    Button,
    Checkbox,
    Container,
    createListCollection,
    Field,
    Flex,
    Heading,
    HStack,
    Input,
    Loader,
    NumberInput,
    Select,
    Stack,
    Text,
    Textarea
} from '@chakra-ui/react';
import {
    ContextType,
    Frequency,
    ShoppingListTemplateItemDto
} from '@komuna/types';
import { useRouter } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toaster } from '../../chakra/ui/toaster';
import { ConfirmDeleteDialog } from '../../components/ConfirmDeleteDialog';
import { useAuth } from '../../context/auth/AuthProvider';
import {
    useCreateGeneralShoppingList,
    useDeleteGeneralShoppingList,
    useGeneralShoppingLists,
    useUpdateGeneralShoppingList,
} from '../../hooks/query/useGeneralShoppingLists';

interface FormData {
    title: string;
    description: string;
    targetContextType: ContextType;
    items: ShoppingListTemplateItemDto[];
    frequency: Frequency;
    interval: number;
    isActive: boolean;
    isManualOnly: boolean;
}

const getFrequencyOptions = (t: any) => createListCollection({
    items: [
        { value: 'DAILY', label: t('shopping.frequency_units.DAILY') },
        { value: 'WEEKLY', label: t('shopping.frequency_units.WEEKLY') },
        { value: 'MONTHLY', label: t('shopping.frequency_units.MONTHLY') },
        { value: 'YEARLY', label: t('shopping.frequency_units.YEARLY') },
    ],
});

const getContextTypeOptions = (t: any) => createListCollection({
    items: [
        { value: 'APARTMENT', label: t('shopping.general_lists.shared_list') },
        { value: 'USER', label: t('shopping.general_lists.personal_list') },
    ],
});

const GeneralShoppingListDetailsPage: React.FC = () => {
    const router = useRouter();
    // Handle both create and edit routes
    const route = router.state.location.pathname;
    const isCreateRoute = route.includes('/create');
    const generalShoppingListId = !isCreateRoute ? route.split('/').pop() : undefined;

    const { t } = useTranslation();
    const { sessionDetails } = useAuth();
    const { data: generalShoppingLists, isLoading: isGeneralShoppingListsLoading } = useGeneralShoppingLists();

    const frequencyOptions = getFrequencyOptions(t);
    const contextTypeOptions = getContextTypeOptions(t);

    const createMutation = useCreateGeneralShoppingList();
    const updateMutation = useUpdateGeneralShoppingList();
    const deleteMutation = useDeleteGeneralShoppingList();

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        targetContextType: ContextType.APARTMENT,
        items: [],
        frequency: Frequency.WEEKLY,
        interval: 1,
        isActive: true,
        isManualOnly: false,
    });

    const isEditing = !!generalShoppingListId;
    const currentList = generalShoppingLists?.find(list => list.generalShoppingListId === generalShoppingListId);

    useEffect(() => {
        if (isEditing && currentList) {
            setFormData({
                title: currentList.title,
                description: currentList.description || '',
                targetContextType: currentList.targetContextType,
                items: currentList.items,
                frequency: currentList.recurrenceRule?.frequency as Frequency || Frequency.WEEKLY,
                interval: currentList.recurrenceRule?.interval || 1,
                isActive: currentList.isActive,
                isManualOnly: currentList.isManualOnly,
            });
        }
    }, [isEditing, currentList]);

    const handleDelete = async () => {
        await deleteMutation.mutateAsync(generalShoppingListId!);
    };

    const handleSave = async () => {
        try {
            // Filter out empty items
            const validItems = formData.items.filter(item => item.name.trim() !== '');

            const dto = {
                title: formData.title,
                description: formData.description,
                targetContextType: formData.targetContextType,
                items: validItems,
                recurrenceRule: formData.isManualOnly ? undefined : {
                    frequency: formData.frequency,
                    interval: formData.interval,
                },
                apartmentId: sessionDetails.apartmentId!,
                isActive: formData.isActive,
                isManualOnly: formData.isManualOnly,
            };

            if (isEditing && currentList) {
                await updateMutation.mutateAsync({
                    generalShoppingListId: currentList.generalShoppingListId,
                    ...dto,
                });
                toaster.create({
                    title: t('common.success'),
                    description: t('shopping.general_lists.update_success'),
                    type: 'success',
                });
                router.navigate({ to: '/roommate/general-shopping-lists' });
            } else {
                const newList = await createMutation.mutateAsync(dto);
                toaster.create({
                    title: t('common.success'),
                    description: t('shopping.general_lists.create_success'),
                    type: 'success',
                });
                router.navigate({ replace: true, to: '/roommate/general-shopping-lists/$generalShoppingListId/items', params: { generalShoppingListId: newList.generalShoppingListId } });
            }
        } catch (error) {
            toaster.create({
                title: t('common.error'),
                description: t('shopping.general_lists.save_error'),
                type: 'error',
            });
        }
    };

    const buttonDisabled =
        !formData.title ||
        (!formData.isManualOnly && (!formData.interval || formData.interval < 1)) ||
        createMutation.isPending ||
        updateMutation.isPending;

    if (isEditing && (isGeneralShoppingListsLoading || !currentList)) {
        return <Loader />;
    }

    return (
        <Box
            bgImage={`url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50' y='50' font-size='60' fill='rgba(167, 243, 208, 0.14)' transform='rotate(30)'%3E🛒%3C/text%3E%3C/svg%3E")`}
            bgRepeat="repeat"
            h="full"
            pt={6}
        >
            <Container maxW="lg" p={8} h="full" display="flex" flexDirection={'column'}>
                <Stack gap={6} flexGrow={1}>
                    <Flex flexDirection={'column'} alignItems="center" gap={4}>
                        <Flex
                            alignItems={'center'}
                            justifyContent={'center'}
                            bg="white"
                            border={'1px solid'}
                            borderColor={'gray.300'}
                            borderRadius="xl"
                            color="gray.500"
                            width="80px"
                            height="80px"
                            fontSize="5xl"
                        >
                            🛒
                        </Flex>
                        <Heading size="2xl" textAlign="center">
                            {isEditing ? t('shopping.general_lists.edit_template') : t('shopping.general_lists.create_template')}
                        </Heading>
                    </Flex>

                    <Box p={6} borderWidth={1} borderRadius="xl" bg="white" h="full" display="flex" flexDirection={'column'}>
                        <Stack gap={4} flexGrow={1}>
                            <Field.Root>
                                <Field.Label fontWeight="bold">
                                    {t('shopping.general_lists.template_name')}
                                </Field.Label>
                                <Input
                                    fontSize={'lg'}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    variant={'flushed'}
                                    placeholder={t('general_templates.example_placeholder')}
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label fontWeight="bold">
                                    {t('shopping.general_lists.description')}
                                </Field.Label>
                                <Textarea
                                    fontSize={'lg'}
                                    alignContent={'end'}
                                    rows={1}
                                    autoresize
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    resize={'none'}
                                    variant={'flushed'}
                                    placeholder={t('general_templates.detailed_description_placeholder')}
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label fontWeight="bold">
                                    {t('shopping.general_lists.context_type')}
                                </Field.Label>
                                <Select.Root
                                    key={formData.targetContextType?.toString()}
                                    collection={contextTypeOptions}
                                    value={[formData.targetContextType.toString()]}
                                    onValueChange={(e) => setFormData({ ...formData, targetContextType: e.value[0] as ContextType })}
                                >
                                    <Select.Control>
                                        <Select.Trigger>
                                            <Select.ValueText />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator />
                                        </Select.IndicatorGroup>
                                    </Select.Control>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {contextTypeOptions.items.map((item) => (
                                                <Select.Item item={item} key={item.value}>
                                                    <Select.ItemText>{item.label}</Select.ItemText>
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Select.Root>
                            </Field.Root>

                            <Field.Root>
                                <Checkbox.Root
                                    checked={formData.isManualOnly}
                                    onCheckedChange={(details) => setFormData({ ...formData, isManualOnly: !!details.checked })}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>{t('shopping.general_lists.manual_template')}</Checkbox.Label>
                                </Checkbox.Root>
                            </Field.Root>

                            {!formData.isManualOnly && (
                                <Field.Root>
                                    <Field.Label fontWeight="bold">
                                        {t('shopping.general_lists.frequency')}
                                    </Field.Label>
                                    <HStack>
                                        <Text>{t('shopping.every')}</Text>
                                        <NumberInput.Root
                                            value={formData.interval.toString()}
                                            onValueChange={(e) => setFormData({ ...formData, interval: e.valueAsNumber || 1 })}
                                            min={1}
                                            w="100px"
                                        >
                                            <NumberInput.Input />
                                        </NumberInput.Root>
                                        <Select.Root
                                            key={formData.frequency?.toString()}
                                            collection={frequencyOptions}
                                            value={[formData.frequency.toString()]}
                                            onValueChange={(e) => setFormData({ ...formData, frequency: e.value[0] as Frequency })}
                                        >
                                            <Select.Control>
                                                <Select.Trigger>
                                                    <Select.ValueText />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {frequencyOptions.items.map((item) => (
                                                        <Select.Item item={item} key={item.value}>
                                                            <Select.ItemText>{item.label}</Select.ItemText>
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Select.Root>
                                    </HStack>
                                </Field.Root>
                            )}

                            <Field.Root>
                                <Checkbox.Root
                                    checked={formData.isActive}
                                    onCheckedChange={(details) => setFormData({ ...formData, isActive: !!details.checked })}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>{t('shopping.general_lists.active')}</Checkbox.Label>
                                </Checkbox.Root>
                            </Field.Root>
                        </Stack>

                        <Flex justifyContent="space-between" gap={3} mt={4}>
                            <Button variant="outline" onClick={() => router.history.back()} size={'lg'}>
                                {t('cancel')}
                            </Button>
                            {isEditing && (
                                <ConfirmDeleteDialog
                                    onConfirm={handleDelete}
                                    itemName={currentList?.title}
                                    isLoading={deleteMutation.isPending}
                                />
                            )}
                            <Button
                                onClick={handleSave}
                                disabled={buttonDisabled}
                                size={'lg'}
                                loading={createMutation.isPending || updateMutation.isPending}
                            >
                                {isEditing ? t('shopping.general_lists.update') : t('shopping.general_lists.create')}
                            </Button>
                        </Flex>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};

export default GeneralShoppingListDetailsPage; 