import { Card, Field, Input, Stack } from "@chakra-ui/react";



interface FormValues {
    title: string;
    dueDate: string;
    description: string;
    assignedTo: string;
    recurrence: string;
}

export const NewTask = () => {




    return (
        <Card.Root>
            <Card.Header>
                <Card.Title>
                    Create A New Task
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Stack>
                    <Field.Root>
                        <Field.Label>
                            Title
                        </Field.Label>
                        <Input />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>
                            Due Date
                        </Field.Label>
                        <Input />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>
                            Description
                        </Field.Label>
                        <Input />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>
                            Assigned To
                        </Field.Label>
                        <Input />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>
                            Recurrence
                        </Field.Label>
                        <Input />
                    </Field.Root>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
}