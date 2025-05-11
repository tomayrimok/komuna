import { Avatar, Button, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IconBellCog, IconHomeCog, IconLogout, IconMenu2, IconSettings, IconUserCog } from '@tabler/icons-react';
import { useAuth } from '../../../context/auth/AuthProvider';
import { Sidebar } from '../../../components/Sidebar/Sidebar';

export const SettingLeftbar = () => {
  const { currentUserDetails, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <Sidebar trigger={<IconMenu2 />}>
      <Stack dir="rtl" padding="6" gap="7">
        <HStack justifyContent="space-between">
          <HStack gap="4">
            <Avatar.Root size="lg" shape="full" border="2px solid" borderColor="brand.900">
              <Avatar.Image src={currentUserDetails?.image} />
              <Avatar.Fallback name="Nue Camp" />
            </Avatar.Root>
            <VStack gap="0" alignItems="start">
              <Text color="brand.900" fontSize="xl">
                {currentUserDetails?.firstName} {currentUserDetails?.lastName}
              </Text>
              <Text color="brand.900" fontSize="sm" dir="ltr">
                {currentUserDetails?.phoneNumber}
              </Text>
            </VStack>
          </HStack>
          <IconSettings />
        </HStack>
        <Stack direction="column" justifyContent="space-between" gap="2" flex="1">
          <VStack align="stretch" gap="4">
            <Button justifyContent="start" variant="ghost" size="lg">
              <IconUserCog />
              {t('roommate_homepage.leftbar.profile_settings')}
            </Button>

            <Button justifyContent="start" variant="ghost" size="lg">
              <IconHomeCog />
              {t('roommate_homepage.leftbar.apartment_settings')}
            </Button>

            <Button justifyContent="start" variant="ghost" size="lg">
              <IconBellCog />
              {t('roommate_homepage.leftbar.notifications_settings')}
            </Button>

            <Button justifyContent="start" variant="ghost" size="lg">
              <IconSettings />
              {t('roommate_homepage.leftbar.app_settings')}
            </Button>
          </VStack>
          <Button justifyContent="start" variant="ghost" size="lg" onClick={logout}>
            <IconLogout />
            {t('roommate_homepage.leftbar.logout')}
          </Button>
        </Stack>
      </Stack>
    </Sidebar>
  );
};
