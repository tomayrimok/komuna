import {
  Box,
  Button,
  Container,
  createListCollection,
  Flex,
  Heading,
  IconButton,
  Input,
  Loader,
  Portal,
  Select,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { IncidentUrgency } from '@komuna/types';
import { IconTrash } from '@tabler/icons-react';
import { useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { IncidentMetadataProvider, useIncidentMetadata } from '../../context/incidents/incidentMetadataProvider';
import { useDeleteIncident } from '../../hooks/query/useDeleteIncident';
import { withWrappers } from '../../utilities/withWrappers';

const IncidentDetailsPage = () => {
  const { incidentDetails, handleSave, incidentId, isIncidentDetailsLoading, updateIncidentDetails } =
    useIncidentMetadata();

  const { mutate: deleteIncident } = useDeleteIncident();

  const router = useRouter();
  const { t } = useTranslation();

  const buttonDisabled = !incidentDetails?.title || !incidentDetails.description || isIncidentDetailsLoading;

  const urgencyLevels = createListCollection({
    items: [
      { value: IncidentUrgency.LOW, label: t('urgency.LOW'), color: 'green.500' },
      { value: IncidentUrgency.MEDIUM, label: t('urgency.MEDIUM'), color: 'yellow.500' },
      { value: IncidentUrgency.HIGH, label: t('urgency.HIGH'), color: 'red.500' },
      { value: IncidentUrgency.EXTREME, label: t('urgency.EXTREME'), color: 'red.700' },
    ],
  });

  const handleDelete = () => {
    deleteIncident(incidentId!);
  };

  if (incidentId && isIncidentDetailsLoading) return <Loader />;

  return (
    <Box
      bgImage={`url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='30' y='60' font-size='60' fill='rgba(248, 113, 113, 0.14)' transform='rotate(0)'%3E🔧%3C/text%3E%3C/svg%3E")`}
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
              🛠️
            </Flex>
            <Heading size="2xl" textAlign="center">
              {incidentId ? t('incidents.edit_incident') : t('incidents.create_incident')}
            </Heading>
          </Flex>

          <Box p={6} borderWidth={1} borderRadius="xl" bg="white" h="full" display="flex" flexDirection={'column'}>
            <Stack gap={4} flexGrow={1}>
              <Box>
                <Text mb={1} fontWeight="bold">
                  {t('incidents.incident_title')}
                </Text>
                <Input
                  fontSize={'lg'}
                  value={incidentDetails?.title || ''}
                  onChange={(e) => updateIncidentDetails({ title: e.target.value })}
                  variant={'flushed'}
                />
              </Box>
              <Box>
                <Text mb={1} fontWeight="bold">
                  {t('incidents.incident_description')}
                </Text>
                <Textarea
                  fontSize={'lg'}
                  value={incidentDetails?.description || ''}
                  resize={'none'}
                  onChange={(e) => updateIncidentDetails({ description: e.target.value })}
                  variant={'flushed'}
                  alignContent={'end'}
                />
              </Box>
              <Box>
                <Text mb={1} fontWeight="bold">
                  {t('incidents.urgency_level')}
                </Text>
                <Select.Root
                  collection={urgencyLevels}
                  value={[incidentDetails?.urgencyLevel || IncidentUrgency.MEDIUM]}
                  onValueChange={(e) => updateIncidentDetails({ urgencyLevel: e.value[0] as IncidentUrgency })}
                >
                  <Select.Control>
                    <Select.Trigger>
                      <Flex alignItems="center" gap={2}>
                        <Box
                          backgroundColor={
                            incidentDetails?.urgencyLevel
                              ? urgencyLevels.find(incidentDetails.urgencyLevel)?.color
                              : 'yellow.500'
                          }
                          borderRadius="full"
                          h={4}
                          w={4}
                        />

                        <Select.ValueText placeholder="Select framework" />
                      </Flex>
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {urgencyLevels.items.map((urgency) => (
                          <Select.Item item={urgency} key={urgency.value}>
                            <Flex alignItems={'center'} gap={2}>
                              <Box backgroundColor={urgency.color} borderRadius="full" h={4} w={4} />
                              {urgency.label}
                            </Flex>
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Box>
            </Stack>
            <Flex justifyContent="space-between" gap={3} mt={4}>
              <Button variant="outline" onClick={() => router.history.back()} size={'lg'}>
                {t('cancel')}
              </Button>
              {incidentId ? (
                <IconButton onClick={handleDelete} colorPalette={'red'} variant={"outline"} size={'lg'} me={"auto"}>
                  <IconTrash />
                </IconButton>
              ) : null}
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

export default withWrappers(IncidentDetailsPage, [IncidentMetadataProvider]);
