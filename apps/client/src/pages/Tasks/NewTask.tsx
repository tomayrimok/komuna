"use client";

import {
  Card,
  Field,
  Input,
  Stack,
  Button,
  Portal,
} from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/menu";
import { useForm } from "react-hook-form";

interface FormValues {
  title: string;
  dueDate: string;
  description: string;
  assignedTo: string;
  recurrence: string;
  images: string[];
  dueTime: string;
}

export const NewTask = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const todayLocal = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  })();

  const onSubmit = (data: FormValues) => {
    // e.g. axios.post("/api/tasks", data)
    console.log("POST payload:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card.Root maxW="sm" mx="auto" zIndex={"10"}>
        <Card.Header>
          <Card.Title>Create A New Task</Card.Title>
        </Card.Header>

        <Card.Body>
          <Stack>
            <Field.Root invalid={!!errors.title} required>
              <Field.Label htmlFor="title">Title</Field.Label>
              <Input
                id="title"
                placeholder="Enter task title"
                {...register("title", {
                  required: "Title is required",
                })}
              />
              <Field.ErrorText>
                {errors.title?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.dueDate} required>
              <Field.Label htmlFor="dueDate">Due Date</Field.Label>
              <Input
                id="dueDate"
                type="date"
                min={todayLocal}
                {...register("dueDate", {
                  required: "Due date is required",
                })}
              />
              <Field.ErrorText>
                {errors.dueDate?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.dueTime} required>
              <Field.Label htmlFor="dueTime">Due Time</Field.Label>
              <Input
                id="dueTime"
                type="time"
                {...register("dueTime", {
                  required: "Due time is required",
                })}
              />
              <Field.ErrorText>
                {errors.dueTime?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.description}>
              <Field.Label htmlFor="description">
                Description
              </Field.Label>
              <Input
                id="description"
                placeholder="Describe the task"
                {...register("description",
                )}
              />
              <Field.ErrorText>
                {errors.description?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.assignedTo} required>
              <Field.Label htmlFor="assignedTo">
                Assigned To
              </Field.Label>

              {/* Chakra Menu: Menu + MenuButton + MenuList + MenuItem */}
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  size="sm"
                  right={"50%"}
                >
                  Open
                </MenuButton>

                {/* Wrap MenuList in Portal so it renders at document.body */}
                <Portal>
                  <MenuList zIndex={"10000"} background={"white"} paddingX={"10px"}>
                    {/* TODO add API call to get all users and list them as MenuItem */}
                    <MenuItem value="new-txt">New Text File</MenuItem>
                    <MenuItem value="new-file">New File…</MenuItem>
                    <MenuItem value="new-win">New Window</MenuItem>
                    <MenuItem value="open-file">Open File…</MenuItem>
                    <MenuItem value="export">Export</MenuItem>
                  </MenuList>
                </Portal>
              </Menu>

              <Field.ErrorText>
                {errors.assignedTo?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.recurrence}>
              <Field.Label htmlFor="recurrence">
                Recurrence
              </Field.Label>
              <Input
                id="recurrence"
                placeholder="e.g. Every Monday"
                {...register("recurrence")}
              />
              <Field.ErrorText>
                {errors.recurrence?.message}
              </Field.ErrorText>
            </Field.Root>
          </Stack>
        </Card.Body>

        <Card.Footer justifyContent="flex-end">
          <Button
            type="submit"
            colorScheme="blue"
            loading={isSubmitting}
          >
            Create Task
          </Button>
        </Card.Footer>
      </Card.Root>
    </form>
  );
};
