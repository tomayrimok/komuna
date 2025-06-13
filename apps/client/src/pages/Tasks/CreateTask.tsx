import { Box, Button, Container, Flex, Heading, Icon, Input, Loader, RadioGroup, Stack, TagCloseTrigger, TagLabel, TagRoot, Text, Textarea, VStack } from '@chakra-ui/react';
import { useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { IncidentMetadataProvider } from '../../context/incidents/incidentMetadataProvider';
import { TaskMetadataProvider, useTaskMetadata } from '../../context/tasks/taskMetadataProvider';
import { withWrappers } from '../../utilities/withWrappers';
import SelectUserDrawer from '../../components/General/selectResidentDrawer';
import { IconPlus, IconX } from '@tabler/icons-react';
import { TaskType } from '@komuna/types';

const TasksDetailsPage = () => {

  const { taskDetails, handleSave, taskId, isTaskDetailsLoading, updateTaskDetails, toggleAssignedTo } = useTaskMetadata();

  const router = useRouter();
  const { t } = useTranslation();

  const buttonDisabled = !taskDetails?.title || isTaskDetailsLoading;

  if (taskId && isTaskDetailsLoading) return <Loader />;

  return (
    <Container maxW="lg" p={8}>
      <Stack gap={6}>
        <Heading size="lg" textAlign="center">
          {taskId ? t('tasks.edit_task') : t('tasks.create_task')}
        </Heading>

        <Box p={4} borderWidth={1} borderRadius="xl" bg="white">
          <Stack gap={4}>
            <Box>
              <Text mb={1} fontWeight="bold">
                {t('task_category.create_task.task_name')}
              </Text>
              <Input
                fontSize={'lg'}
                value={taskDetails?.title || ''}
                onChange={(e) => updateTaskDetails({ title: e.target.value })}
                variant={'flushed'}
              />
            </Box>
            <Box>
              <Text mb={1} fontWeight="bold">
                {t('task_category.create_task.description')}
              </Text>
              <Textarea
                fontSize={'lg'}
                value={taskDetails?.description || ''}
                resize={'none'}
                onChange={(e) => updateTaskDetails({ description: e.target.value })}
                variant={'flushed'}
                alignContent={'end'}
              />
            </Box>
            <Box>
              <Text mb={1} fontWeight="bold">
                {t('task_category.create_task.due_date')}
              </Text>
              <Input
                type="date"
                fontSize={'lg'}
                min={new Date().toISOString().split('T')[0]}
                value={taskDetails?.dueDate ? new Date(taskDetails?.dueDate).toISOString().split('T')[0] : ''}
                resize={'none'}
                onChange={(e) => updateTaskDetails({ dueDate: e.target.value })}
                variant={'flushed'}
              />
            </Box>

            <Box>
              <Text mb={1} fontWeight="bold">
                {t('task_category.create_task.assigned_to')}
              </Text>
              <Flex
                flexWrap={'wrap'}
                gap={2}
                mt={2}
              >
                {taskDetails?.assignedTo?.map((user) => (
                  <TagRoot key={user.userId} p={3} py={2} fontSize={"md"} borderRadius={'md'} variant={"outline"}>
                    <TagLabel fontSize="md"> {user.firstName} {user.lastName} </TagLabel>
                    <TagCloseTrigger asChild onClick={() => toggleAssignedTo(user)}>
                      <Button size={"2xs"} borderRadius={'full'} p={0} variant={"subtle"} ms={2}>
                        <IconX />
                      </Button>
                    </TagCloseTrigger>
                  </TagRoot>
                ))}
                <SelectUserDrawer
                  size="lg"
                  onSelect={(user) => toggleAssignedTo(user)}
                  multiple
                  selected={taskDetails?.assignedTo?.map(u => u.userId) || []}
                  trigger={
                    <Button
                      p={3}
                      fontSize={"md"}
                      borderRadius={'md'}
                      variant={"subtle"}
                    >
                      <Icon size={"sm"}>
                        <IconPlus />
                      </Icon>
                      {t('add-roommates')}
                    </Button>
                  }
                />
              </Flex>
            </Box>
            <Box>
              <Text mb={1} fontWeight="bold">
                סוג מטלה
              </Text>
              <Box>
                <RadioGroup.Root variant={"subtle"} value={taskDetails?.taskType || TaskType.GROUP} onValueChange={(e) => updateTaskDetails({ taskType: e.value as TaskType })}>
                  <VStack alignItems={'start'} >
                    <RadioGroup.Item value={TaskType.GROUP}>
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText display={'flex'} gap={1}>
                        <Text>
                          קבוצתית
                        </Text>
                        <Text fontSize={'sm'} color={'gray.500'}>
                          (שותף אחד מסמן שהמטלה הושלמה עבור כולם)
                        </Text>
                      </RadioGroup.ItemText>
                    </RadioGroup.Item>
                    <RadioGroup.Item value={TaskType.PERSONAL}>
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText display={'flex'} gap={1}>
                        <Text>
                          אישית
                        </Text>
                        <Text fontSize={'sm'} color={'gray.500'}>
                          (כל שותף מסמן שהמטלה הושלמה עבורו)
                        </Text>
                      </RadioGroup.ItemText>
                    </RadioGroup.Item>
                  </VStack>
                </RadioGroup.Root>

              </Box>
            </Box>

            {taskDetails?.createdBy && (
              <Flex justifyContent="flex-start" mt={4} gap={3}>
                <Text mb={1} fontWeight="bold">
                  {t('task_category.create_task.created_by')}
                </Text>
                <Text color="gray.600" fontSize="md" mb={2}>
                  {`${taskDetails.createdBy.firstName} ${taskDetails.createdBy.lastName || ''}`}
                </Text>
              </Flex>
            )}

          </Stack>
          <Flex justifyContent="space-between" gap={3} mt={4}>
            <Button variant="outline" onClick={() => router.history.back()} size={'lg'}>
              {t('cancel')}
            </Button>
            <Button colorScheme="blue" onClick={handleSave} disabled={buttonDisabled} size={'lg'}>
              {t('save')}
            </Button>
          </Flex>
        </Box>
      </Stack >
    </Container >
  );
};

export default withWrappers(TasksDetailsPage, [TaskMetadataProvider]);
