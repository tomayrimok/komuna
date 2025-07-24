import { Button, createListCollection, Drawer, Field, HStack, Input, Portal, Select, Text, VStack } from "@chakra-ui/react";
import { CloseButton, Textarea } from "@chakra-ui/react";
import { Frequency, GeneralTaskResponseDto, TaskType } from "@komuna/types";

import { useEffect, useState } from "react";
import { useCreateGeneralTask, useUpdateGeneralTask } from "../../hooks/query/useGeneralTasks";
import { useAuth } from "../../context/auth/AuthProvider";
import { toaster } from "../../chakra/ui/toaster";


interface FormData {
    title: string;
    description: string;
    taskType: TaskType;
    defaultDueTime: string;
    frequency: Frequency;
    interval: number;
    isActive: boolean;
}

const frequencyOptions = createListCollection({
    items: [
        { value: Frequency.DAILY, label: 'ימים' },
        { value: Frequency.WEEKLY, label: 'שבועות' },
        { value: Frequency.MONTHLY, label: 'חודשים' },
        { value: Frequency.YEARLY, label: 'שנים' },
    ],
});

const taskTypeOptions = createListCollection({
    items: [
        { value: TaskType.GROUP, label: 'משימה קבוצתית' },
        { value: TaskType.PERSONAL, label: 'משימה אישית' },
    ],
});

interface GeneralTaskDetailsProps {
    selectedTask: GeneralTaskResponseDto | null;
    setSelectedTask: (task: GeneralTaskResponseDto | null) => void;
    setIsDrawerOpen: (isOpen: boolean) => void;
    setIsEditing: (isEditing: boolean) => void;
    isDrawerOpen: boolean;
    isEditing: boolean;
}

const GeneralTaskDetails = ({ selectedTask, setSelectedTask, setIsDrawerOpen, setIsEditing, isDrawerOpen, isEditing }: GeneralTaskDetailsProps) => {


    const createMutation = useCreateGeneralTask();
    const updateMutation = useUpdateGeneralTask();
    const { sessionDetails } = useAuth();

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        taskType: TaskType.GROUP,
        defaultDueTime: '',
        frequency: Frequency.WEEKLY,
        interval: 1,
        isActive: true,
    });


    useEffect(() => {
        if (selectedTask) {
            setFormData({
                title: selectedTask.title,
                description: selectedTask.description || '',
                taskType: selectedTask.taskType,
                defaultDueTime: selectedTask.defaultDueTime || '',
                frequency: selectedTask.recurrenceRule.frequency as Frequency,
                interval: selectedTask.recurrenceRule.interval || 1,
                isActive: selectedTask.isActive,
            });
            setIsEditing(true);
        }
        else {
            setFormData({
                title: '',
                description: '',
                taskType: TaskType.GROUP,
                defaultDueTime: '',
                frequency: Frequency.WEEKLY,
                interval: 1,
                isActive: true,
            });
        }
    }, [selectedTask]);


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
                },
                apartmentId: sessionDetails.apartmentId!,
                isActive: formData.isActive,
            };

            if (isEditing && selectedTask) {
                await updateMutation.mutateAsync({
                    generalTaskId: selectedTask.generalTaskId,
                    ...dto,
                });
                toaster.create({
                    title: 'Success',
                    description: 'General task updated successfully',
                    type: 'success',
                });
            } else {
                await createMutation.mutateAsync(dto);
                toaster.create({
                    title: 'Success',
                    description: 'General task created successfully',
                    type: 'success',
                });
            }
            setIsDrawerOpen(false);
        } catch (error) {
            toaster.create({
                title: 'Error',
                description: 'Failed to save general task',
                type: 'error',
            });
        }
    };
    return (
        <Portal>
            <Drawer.Root open={isDrawerOpen} onOpenChange={(e) => setIsDrawerOpen(e.open)} placement="bottom" size="lg">
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>
                                {isEditing ? 'עריכת תבנית משימה' : 'יצירת תבנית משימה'}
                            </Drawer.Title>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton />
                            </Drawer.CloseTrigger>
                        </Drawer.Header>
                        <Drawer.Body>
                            <VStack gap="4">
                                <Field.Root>
                                    <Field.Label>כותרת המשימה</Field.Label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>תיאור המשימה</Field.Label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>סוג המשימה</Field.Label>
                                    <Select.Root
                                        collection={taskTypeOptions}
                                        value={[formData.taskType]}
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
                                    <Field.Label>זמן ברירת מחדל (אופציונלי)</Field.Label>
                                    <Input
                                        type="time"
                                        value={formData.defaultDueTime}
                                        onChange={(e) => setFormData({ ...formData, defaultDueTime: e.target.value })}
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>תדירות</Field.Label>
                                    <HStack>
                                        <Text>כל</Text>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={formData.interval}
                                            onChange={(e) => setFormData({ ...formData, interval: parseInt(e.target.value) || 1 })}
                                        />
                                        <Select.Root
                                            collection={frequencyOptions}
                                            value={[formData.frequency]}
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
                                                        <Select.Item key={item.value} item={item.value}>
                                                            <Select.ItemText>{item.label}</Select.ItemText>
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Select.Root>
                                    </HStack>
                                </Field.Root>


                                <Field.Root>
                                    <Field.Label>פעיל</Field.Label>
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                </Field.Root>
                            </VStack>
                        </Drawer.Body>
                        <Drawer.Footer>
                            <HStack>
                                <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                                    ביטול
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    loading={createMutation.isPending || updateMutation.isPending}
                                >
                                    {isEditing ? 'עדכון' : 'יצירה'}
                                </Button>
                            </HStack>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>
        </Portal>
    )
};

export default GeneralTaskDetails;