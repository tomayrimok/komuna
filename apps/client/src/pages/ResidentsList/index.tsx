/* eslint-disable react/style-prop-object */
import { useApartmentResidents } from '../../hooks/query/useApartmentResidents';
import {
  Avatar,
  Box,
  Card,
  Flex,
  Text,
  Badge,
  VStack,
  HStack,
  SkeletonText,
  For,
  FormatNumber,
  Stack,
  Image,
} from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { roundUpToXDigits } from '../../utilities/roundUpToXDigits';
import { GoBackButton } from '../../components/GoBackButton';
import { UserRole } from '@komuna/types';
import { useAuth } from '../../context/auth/AuthProvider';

export const ResidentsList = () => {
  const { data: residents, isLoading } = useApartmentResidents();
  const { sessionDetails } = useAuth();
  const { t } = useTranslation();
  const isLandlord = sessionDetails?.role === UserRole.LANDLORD;

  if (isLoading) {
    return (
      <VStack gap="4" p="6">
        <Text fontSize="2xl" fontWeight="bold">
          {t('residents.title')}
        </Text>
        <Stack gap="4" width="100%">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card.Root key={index} variant="elevated">
              <Card.Body>
                <HStack gap="4">
                  <SkeletonText noOfLines={1} width="60px" height="60px" />
                  <VStack alignItems="start" flex="1">
                    <SkeletonText noOfLines={1} width="120px" />
                    <SkeletonText noOfLines={1} width="80px" />
                    <SkeletonText noOfLines={1} width="100px" />
                  </VStack>
                </HStack>
              </Card.Body>
            </Card.Root>
          ))}
        </Stack>
      </VStack>
    );
  }

  return (
    <VStack gap="6" p="6" flex="1">
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        <Stack flexDirection="row" gap="2" alignItems="center">
          <GoBackButton variant="ghost" size="lg" iconDirection="right" />

          <Text fontSize="2xl" fontWeight="bold">
            {isLandlord ? t('residents.landlord_title') : t('residents.title')}
          </Text>
        </Stack>
        <Badge variant="solid" colorPalette="brand" size="lg">
          {t('residents.residents_amount', { amount: residents?.length })}
        </Badge>
      </Flex>

      {/* Summary Footer */}
      {!!residents?.length && (
        <Card.Root variant="elevated" bg="white" width="100%">
          <Card.Body p="4">
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                {t('residents.total_rent')}
              </Text>
              <HStack gap="1" alignItems="baseline">
                <Text fontSize="lg" fontWeight="bold" color="green.600">
                  <FormatNumber
                    value={roundUpToXDigits(residents?.reduce((total, resident) => total + (resident.rent || 0), 0))}
                    style="currency"
                    currency="ILS"
                  />
                </Text>
              </HStack>
            </HStack>
          </Card.Body>
        </Card.Root>
      )}
      {/* Residents List */}
      {residents?.length ? (
        <Stack gap="4" width="100%" flex="1" justifyContent="center">
          <For each={residents}>
            {(resident) => (
              <Card.Root
                key={resident.userId}
                variant="elevated"
                _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <Card.Body p="6">
                  <HStack gap="4" alignItems="start">
                    {/* Avatar */}
                    <Avatar.Root size="xl" shape="full">
                      <Avatar.Image src={resident.user?.image} alt={resident.user?.firstName} />
                      <Avatar.Fallback name={`${resident.user?.firstName} ${resident.user?.lastName}`} />
                    </Avatar.Root>

                    {/* Main Content */}
                    <VStack alignItems="start" flex="1" gap="3">
                      {/* Name and Role */}
                      <HStack gap="3" alignItems="center">
                        <Text fontSize="xl" fontWeight="bold">
                          {resident.user?.firstName} {resident.user?.lastName}
                        </Text>
                      </HStack>

                      {/* Phone Number */}
                      <Text fontSize="sm" color="gray.500" dir="ltr">
                        {resident.user?.phoneNumber}
                      </Text>

                      {/* Rent and Join Date */}
                      <HStack gap="6" justifyContent="space-between" alignItems="center">
                        {/* Rent Amount */}
                        <VStack alignItems="start" gap="1">
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">
                            {t('residents.rent')}
                          </Text>
                          <HStack gap="1" alignItems="baseline">
                            <Text fontSize="lg" fontWeight="bold">
                              {resident.rent ? (
                                <FormatNumber value={roundUpToXDigits(resident.rent)} style="currency" currency="ILS" />
                              ) : (
                                '-'
                              )}
                            </Text>
                          </HStack>
                        </VStack>

                        {/* Join Date */}
                        <VStack alignItems="start" gap="1">
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">
                            {t('residents.joined_at')}
                          </Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {format(parseISO(resident.createdAt), 'dd/MM/yyyy')}
                          </Text>
                        </VStack>
                      </HStack>

                      {/* Additional Info for Payable By */}
                      {resident.payableByUser && resident.payableByUser.userId !== resident.userId && (
                        <Box mt="2" p="2" bg="orange.50" borderRadius="md" border="1px solid" borderColor="orange.200">
                          <Text fontSize="xs" color="orange.700">
                            {t('residents.rent-paid-by', 'Rent paid by: {{name}}', {
                              name: `${resident.payableByUser.firstName} ${resident.payableByUser.lastName}`,
                            })}
                          </Text>
                        </Box>
                      )}
                    </VStack>
                  </HStack>
                </Card.Body>
              </Card.Root>
            )}
          </For>
        </Stack>
      ) : (
        <VStack justifyContent="center" flex="1">
          <Image src="/meerkats/lonely.png" width="50vw" />
          <Text fontSize="2xl" fontWeight="bold">
            {t('residents.no-residents')}
          </Text>
          <Text fontSize="lg" color="gray.500">
            {t('residents.no-residents-description')}
          </Text>
        </VStack>
      )}
    </VStack>
  );
};
