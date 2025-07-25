import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Loader,
    Stack,
    Text,
    Textarea,
    Input,
    Field,
    Select,
    createListCollection,
    HStack,
    NumberInput,
    Checkbox,
} from '@chakra-ui/react';
import { useRouter, useParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Frequency, GeneralTaskResponseDto, TaskType } from '@komuna/types';
import {
    useGeneralTasks,
    useCreateGeneralTask,
    useUpdateGeneralTask,
} from '../../hooks/query/useGeneralTasks';
import { useAuth } from '../../context/auth/AuthProvider';
import { toaster } from '../../chakra/ui/toaster';

interface FormData {
    title: string;
    description: string;
    taskType: TaskType;
    defaultDueTime?: string;
    frequency: Frequency;
    interval: number;
    isActive: boolean;
}

const frequencyOptions = createListCollection({
    items: [
        { value: 'DAILY', label: 'ימים' },
        { value: 'WEEKLY', label: 'שבועות' },
        { value: 'MONTHLY', label: 'חודשים' },
        { value: 'YEARLY', label: 'שנים' },
    ],
});

const taskTypeOptions = createListCollection({
    items: [
        { value: 'GROUP', label: 'משימה קבוצתית' },
        { value: 'PERSONAL', label: 'משימה אישית' },
    ],
});

const GeneralTaskDetailsPage: React.FC = () => {
    const router = useRouter();
    // Handle both create and edit routes
    const route = router.state.location.pathname;
    const isCreateRoute = route.includes('/create');
    const generalTaskId = !isCreateRoute ? route.split('/').pop() : undefined;

    const { t } = useTranslation();
    const { sessionDetails } = useAuth();
    const { data: generalTasks, isLoading: isGeneralTasksLoading } = useGeneralTasks();

    const createMutation = useCreateGeneralTask();
    const updateMutation = useUpdateGeneralTask();

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        taskType: TaskType.GROUP,
        defaultDueTime: undefined,
        frequency: Frequency.WEEKLY,
        interval: 1,
        isActive: true,
    });

    const isEditing = !!generalTaskId;
    const currentTask = generalTasks?.find(task => task.generalTaskId === generalTaskId);

    useEffect(() => {
        if (isEditing && currentTask) {
            setFormData({
                title: currentTask.title,
                description: currentTask.description || '',
                taskType: currentTask.taskType,
                defaultDueTime: currentTask.defaultDueTime,
                frequency: currentTask.recurrenceRule.frequency as Frequency,
                interval: currentTask.recurrenceRule.interval || 1,
                isActive: currentTask.isActive,
            });
        }
    }, [isEditing, currentTask]);

    const handleSave = async () => {
        try {
            const dto = {
                title: formData.title,
                description: formData.description,
                taskType: formData.taskType,
                defaultDueTime: formData.defaultDueTime,
                recurrenceRule: {
                    frequency: formData.frequency,
                    interval: formData.interval,
                } as any,
                apartmentId: sessionDetails.apartmentId!,
                isActive: formData.isActive,
            };

            if (isEditing && currentTask) {
                await updateMutation.mutateAsync({
                    generalTaskId: currentTask.generalTaskId,
                    ...dto,
                });
                toaster.create({
                    title: 'הצלחה',
                    description: 'תבנית המשימה עודכנה בהצלחה',
                    type: 'success',
                });
            } else {
                await createMutation.mutateAsync(dto);
                toaster.create({
                    title: 'הצלחה',
                    description: 'תבנית המשימה נוצרה בהצלחה',
                    type: 'success',
                });
            }
            router.navigate({ to: '/roommate/general-tasks' });
        } catch (error) {
            toaster.create({
                title: 'שגיאה',
                description: 'שמירת תבנית המשימה נכשלה',
                type: 'error',
            });
        }
    };

    const buttonDisabled =
        !formData.title ||
        !formData.interval ||
        formData.interval < 1 ||
        createMutation.isPending ||
        updateMutation.isPending;

    if (isEditing && (isGeneralTasksLoading || !currentTask)) {
        return <Loader />;
    }

    return (
        <Box
            bgImage={`url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50' y='50' font-size='60' fill='rgba(167, 243, 208, 0.14)' transform='rotate(30)'%3E📋%3C/text%3E%3C/svg%3E")`}
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
                            📋
                        </Flex>
                        <Heading size="2xl" textAlign="center">
                            {isEditing ? 'עריכת תבנית משימה' : 'יצירת תבנית משימה'}
                        </Heading>
                    </Flex>

                    <Box p={6} borderWidth={1} borderRadius="xl" bg="white" h="full" display="flex" flexDirection={'column'}>
                        <Stack gap={4} flexGrow={1}>
                            <Field.Root>
                                <Field.Label fontWeight="bold">
                                    כותרת המשימה
                                </Field.Label>
                                <Input
                                    fontSize={'lg'}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    variant={'flushed'}
                                    placeholder="לדוגמה: ניקוי חדר רחצה"
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label fontWeight="bold">
                                    תיאור המשימה
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
                                    placeholder="תיאור מפורט של המשימה (אופציונלי)"
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label fontWeight="bold">
                                    סוג המשימה
                                </Field.Label>
                                <Select.Root
                                    key={formData.taskType?.toString()}
                                    collection={taskTypeOptions}
                                    value={[formData.taskType.toString()]}
                                    onValueChange={(e) => setFormData({ ...formData, taskType: e.value[0] as TaskType })}
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
                                            {taskTypeOptions.items.map((item) => (
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
                                <Field.Label fontWeight="bold">
                                    תדירות המשימה
                                </Field.Label>
                                <HStack>
                                    <Text>כל</Text>
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

                            <Field.Root>
                                <Field.Label fontWeight="bold">
                                    שעת ברירת מחדל (אופציונלי)
                                </Field.Label>
                                <Input
                                    type="time"
                                    fontSize={'lg'}
                                    value={formData.defaultDueTime}
                                    onChange={(e) => setFormData({ ...formData, defaultDueTime: e.target.value })}
                                    variant={'flushed'}
                                />
                            </Field.Root>

                            <Field.Root>
                                <Checkbox.Root
                                    checked={formData.isActive}
                                    onCheckedChange={(details) => setFormData({ ...formData, isActive: !!details.checked })}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>תבנית פעילה</Checkbox.Label>
                                </Checkbox.Root>
                            </Field.Root>
                        </Stack>

                        <Flex justifyContent="space-between" gap={3} mt={4}>
                            <Button variant="outline" onClick={() => router.history.back()} size={'lg'}>
                                ביטול
                            </Button>
                            <Button
                                colorScheme="blue"
                                onClick={handleSave}
                                disabled={buttonDisabled}
                                size={'lg'}
                                loading={createMutation.isPending || updateMutation.isPending}
                            >
                                {isEditing ? 'עדכון' : 'יצירה'}
                            </Button>
                        </Flex>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};

export default GeneralTaskDetailsPage;