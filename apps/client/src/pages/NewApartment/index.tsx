import { Button, Image, Link, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/auth/AuthProvider';
import { useNavigate } from '@tanstack/react-router';
import ApartmentLayout from './ApartmentLayout';
import { IconArrowRight } from '@tabler/icons-react';

export const NewApartment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUserDetails } = useAuth();

  const hasApartments = !!currentUserDetails?.apartments.length || !!currentUserDetails?.landlordApartments.length;
  return (
    <ApartmentLayout
      goBack={
        currentUserDetails?.apartments && currentUserDetails.apartments.length > 0
          ? () => navigate({ to: '/select-apartment' })
          : undefined
      }
    >
      {/* <VStack flexGrow={1} overflow={"auto"} width="100vw" paddingTop={"35px"}> */}
      <VStack>
        <Text fontSize="2xl" fontWeight="bold">
          {hasApartments ? t('select_apartment.has_apartments.title') : t('select_apartment.no_apartments.title')}
        </Text>
        <Text fontSize="lg">
          {!hasApartments &&
            t('select_apartment.no_apartments.description', { firstName: currentUserDetails?.firstName })}
        </Text>
      </VStack>
      <VStack gap="12">
        <Button
          gap="4"
          variant={"plain"}
          onClick={() => {
            navigate({ to: '/join-apartment' });
          }}
          as={VStack}
          height={"fit-content"}
          color={"brand.900"}
        >
          <Image src="/detailed_icons/join_apartment.png" maxW="200px" />
          <Button fontSize="2xl" fontWeight="bold" >
            {t('select_apartment.no_apartments.join_apartment')}
          </Button>
        </Button>
        <Button
          as={VStack}
          gap="5"
          variant={"plain"}
          onClick={() => {
            navigate({ to: '/create-apartment' });
          }}
          color={"brand.900"}
          height={"fit-content"}
        >
          <Image src="/detailed_icons/create_apartment.png" maxW="200px" />
          <Button fontSize="2xl" fontWeight="bold" >
            {t('select_apartment.no_apartments.create_new_apartment')}
          </Button>
        </Button>
        {hasApartments && (
          <Link
            fontSize="lg"
            textDecoration="underline"
            fontWeight="bold"
            color="brand.900"
            marginBottom="20px"
            onClick={() => {
              navigate({ to: '/select-apartment' });
            }}
          >
            <IconArrowRight />
            {t('select_apartment.has_apartments.apartments_list')}
          </Link>
        )}
      </VStack>
      {/* </VStack> */}
    </ApartmentLayout>
  );
};
