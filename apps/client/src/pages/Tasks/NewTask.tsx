"use client";
import {
  Card,
  Field,
  Input,
  Stack,
  Button,
  Portal,
  Text,
  HStack,
} from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/menu";
import { useForm } from "react-hook-form";
import { useIsRTL } from "../../hooks/useIsRTL";
import { useTranslation } from "react-i18next";

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
  const { isRTL } = useIsRTL();
  const { t } = useTranslation()

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
              <Field.Label htmlFor="title">{t("task_category.create_task.title")}</Field.Label>
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
              <Field.Label htmlFor="dueDate">{t("task_category.create_task.due_date")}</Field.Label>
              <Input
                id="dueDate"
                textAlign={"left"}
                placeholder="DD-MM-YYYY"
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
              <Field.Label htmlFor="dueTime">{t("task_category.create_task.due_time")}</Field.Label>
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
                {t("task_category.create_task.description")}
              </Field.Label>
              <Input
                id="description"
                {...register("description",
                )}
              />
              <Field.ErrorText>
                {errors.description?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.assignedTo} required>
              <Field.Label htmlFor="assignedTo">
                {t("task_category.create_task.assigned_to")}
              </Field.Label>

              {/* Chakra Menu: Menu + MenuButton + MenuList + MenuItem */}
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  size="md"
                  right={"73%"}
                  mt={"-10px"}
                  fontWeight={"bold"}
                  borderColor={"brand.900"}
                >
                  Choose
                </MenuButton>

                {/* Wrap MenuList in Portal so it renders at document.body */}
                <Portal>
                  <MenuList zIndex={"10000"} background={"white"} paddingX={"10px"}>
                    {/* TODO add API call to get all users and list them as MenuItem */}
                    <MenuItem value="new-txt">Noam</MenuItem>
                    <MenuItem value="new-file">Tom</MenuItem>
                    <MenuItem value="new-win">Shani</MenuItem>
                    <MenuItem value="open-file">Adi</MenuItem>
                    <MenuItem value="export">Liad</MenuItem>
                  </MenuList>
                </Portal>
              </Menu>

              <Field.ErrorText>
                {errors.assignedTo?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.recurrence}>
              <Field.Label htmlFor="recurrence">
                {t("task_category.create_task.recurrence")}
              </Field.Label>
              <HStack>
                <Input
                  id="recurrence"
                  placeholder="e.g. Every Monday"
                  {...register("recurrence")}
                />
                <Text left={"10%"}>Every</Text>
                <Field.ErrorText>
                  {errors.recurrence?.message}
                </Field.ErrorText>
              </HStack>
            </Field.Root>
          </Stack>
        </Card.Body>

        <Card.Footer justifyContent="flex-end">
          <Button
            type="submit"
            colorScheme="blue"
            loading={isSubmitting}
          >
            {t("task_category.create_task.create_task")}
          </Button>
        </Card.Footer>
      </Card.Root>
    </form>
  );
};
