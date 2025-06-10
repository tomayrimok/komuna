import { Box, Button, Container, Flex, Heading, Input, Loader, Stack, Text, Textarea } from '@chakra-ui/react';
import { useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { IncidentMetadataProvider } from '../../context/incidents/incidentMetadataProvider';
import { TaskMetadataProvider, useTaskMetadata } from '../../context/tasks/taskMetadataProvider';
import { withWrappers } from '../../utilities/withWrappers';

const TasksDetailsPage = () => {
  const { taskDetails, handleSave, taskId, isTaskDetailsLoading, updateTaskDetails } =
    useTaskMetadata();

  const router = useRouter();
  const { t } = useTranslation();

  const buttonDisabled = !taskDetails?.title || !taskDetails.description || isTaskDetailsLoading;

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
                {t('tasks.task_title')}
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
                {t('incidents.incident_description')}
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
                {t('incidents.urgency_level')}
              </Text>
            </Box>
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
      </Stack>
    </Container>
  );
};

export default withWrappers(TasksDetailsPage, [TaskMetadataProvider]);
