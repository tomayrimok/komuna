import { Box, Button, Container, Flex, Heading, Icon, IconButton, Input, Loader, RadioGroup, Stack, TagCloseTrigger, TagLabel, TagRoot, Text, Textarea, VStack } from '@chakra-ui/react';
import { TaskType } from '@komuna/types';
import { IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import { useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import SelectUserDrawer from '../../components/General/selectResidentDrawer';
import { TaskMetadataProvider, useTaskMetadata } from '../../context/tasks/taskMetadataProvider';
import { withWrappers } from '../../utilities/withWrappers';
import { parseDate, toISODateString } from '../../utils/dateUtils';

const TasksDetailsPage = () => {

  const { taskDetails, handleSave, taskId, isTaskDetailsLoading, updateTaskDetails, toggleAssignedTo, handleDelete } = useTaskMetadata();

  const router = useRouter();
  const { t } = useTranslation();

  const buttonDisabled = !taskDetails?.title || isTaskDetailsLoading;

  if (taskId && isTaskDetailsLoading) return <Loader />;

  return (
    <Box
      bgImage={`url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='20' y='60' font-size='60' fill='rgba(34, 197, 94, 0.11)' transform='rotate(0)'%3E🎯%3C/text%3E%3C/svg%3E")`}
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
              🎯
            </Flex>
            <Heading size="2xl" textAlign="center">
              {taskId ? t('tasks.edit_task') : t('tasks.create_task')}
            </Heading>
          </Flex>

          <Box p={6} borderWidth={1} borderRadius="xl" bg="white" h="full" display="flex" flexDirection={'column'}>
            <Stack gap={4} flexGrow={1}>
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
                  min={toISODateString(new Date())}
                  value={taskDetails?.dueDate ? toISODateString(parseDate(taskDetails.dueDate)) : ''}
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
                  סוג משימה
                </Text>
                <Box>
                  <RadioGroup.Root variant={"subtle"} value={taskDetails?.taskType || TaskType.GROUP} onValueChange={(e) => updateTaskDetails({ taskType: e.value as TaskType })}>
                    <VStack alignItems={'start'} >
                      <RadioGroup.Item value={TaskType.GROUP} alignItems={'start'}>
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText display={'flex'} gap={1}>
                          <Text>
                            קבוצתית
                          </Text>
                          <Text fontSize={'sm'} color={'gray.500'}>
                            (שותף אחד מסמן שהמשימה הושלמה עבור כולם)
                          </Text>
                        </RadioGroup.ItemText>
                      </RadioGroup.Item>
                      <RadioGroup.Item value={TaskType.PERSONAL} alignItems={'start'}>
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText display={'flex'} gap={1}>
                          <Text>
                            אישית
                          </Text>
                          <Text fontSize={'sm'} color={'gray.500'}>
                            (כל שותף מסמן שהמשימה הושלמה עבורו)
                          </Text>
                        </RadioGroup.ItemText>
                      </RadioGroup.Item>
                    </VStack>
                  </RadioGroup.Root>

                </Box>
              </Box>

            </Stack>
            <Flex justifyContent="space-between" gap={3} mt={4}>
              <Button variant="outline" onClick={() => router.history.back()} size={'lg'}>
                {t('cancel')}
              </Button>
              {taskId &&
                <IconButton colorPalette="red" variant="outline" me="auto" onClick={handleDelete} disabled={isTaskDetailsLoading} size={'lg'} >
                  <IconTrash />
                </IconButton>
              }
              <Button colorScheme="blue" onClick={handleSave} disabled={buttonDisabled} size={'lg'}>
                {t('save')}
              </Button>
            </Flex>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default withWrappers(TasksDetailsPage, [TaskMetadataProvider]);
