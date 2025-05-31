"use client";

import {
  Card,
  Field,
  Input,
  Stack,
  Button,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface FormValues {
  title: string;
  dueDate: string;
  description: string;
  assignedTo: string;
  recurrence: string;
}

export const NewTask = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

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
                {...register("dueDate", {
                  required: "Due date is required",
                })}
              />
              <Field.ErrorText>
                {errors.dueDate?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.description} required>
              <Field.Label htmlFor="description">
                Description
              </Field.Label>
              <Input
                id="description"
                placeholder="Describe the task"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              <Field.ErrorText>
                {errors.description?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.assignedTo} required>
              <Field.Label htmlFor="assignedTo">
                Assigned To
              </Field.Label>
              <Input
                id="assignedTo"
                placeholder="User email or name"
                {...register("assignedTo", {
                  required: "Please specify assignee",
                })}
              />
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
