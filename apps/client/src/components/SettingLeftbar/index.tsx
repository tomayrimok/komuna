import { Avatar, Button, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  IconBellCog,
  IconHomeCog,
  IconLogout,
  IconMenu2,
  IconSettings,
  IconUserCog,
  IconHomeEdit,
  IconUsersGroup,
  IconShoppingCart,
} from '@tabler/icons-react';
import { useAuth } from '../../context/auth/AuthProvider';
import { Sidebar } from './Sidebar/Sidebar';
import { LanguegeSelector } from '../LanguegeSelector';
import { useIsRTL } from '../../hooks/useIsRTL';
import { useNavigate } from '@tanstack/react-router';
import { UserRole } from '@komuna/types';

export const SettingLeftbar = () => {
  const { currentUserDetails, logout, sessionDetails } = useAuth();
  const { dir } = useIsRTL();
  const { t } = useTranslation();
  const isLandlord = sessionDetails?.role === UserRole.LANDLORD;
  const navigate = useNavigate();

  if (isLandlord) {
    return (
      <Sidebar trigger={<IconMenu2 />}>
      <Stack dir={dir} padding="6" gap="7">
        <HStack justifyContent="space-between">
          <HStack gap="4">
            <Avatar.Root size="lg" shape="full" border="2px solid" borderColor="brand.900">
              <Avatar.Image src={currentUserDetails?.image} />
              <Avatar.Fallback name="avatar" />
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
        </HStack>
        <Stack direction="column" justifyContent="space-between" gap="2" flex="1">
          <VStack align="stretch" gap="4">
            <Button justifyContent="start" variant="ghost" size="lg">
              <IconUserCog />
              {t('roommate.homepage.leftbar.profile_settings')}
            </Button>

            <Button justifyContent="start" variant="ghost" size="lg">
              <IconHomeCog />
              {t('roommate.homepage.leftbar.apartment_settings')}
            </Button>

            <Button
              justifyContent="start"
              variant="ghost"
              size="lg"
              onClick={() => navigate({ to: '/landlord/residents'})}
            >
              <IconUsersGroup />
              {t('residents.landlord_title')}
            </Button>

            <Button
              justifyContent="start"
              variant="ghost"
              size="lg"
              onClick={() => navigate({ to: '/select-apartment' })}
            >
              <IconHomeEdit />
              {t('roommate.homepage.leftbar.select_apartment')}
            </Button>
          </VStack>
          <Stack gap="4" alignItems="start">
            <LanguegeSelector />
            <Button justifyContent="start" variant="ghost" size="lg" onClick={logout}>
              <IconLogout />
              {t('roommate.homepage.leftbar.logout')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Sidebar>
    )
  }
  return (
    <Sidebar trigger={<IconMenu2 />}>
      <Stack dir={dir} padding="6" gap="7">
        <HStack justifyContent="space-between">
          <HStack gap="4">
            <Avatar.Root size="lg" shape="full" border="2px solid" borderColor="brand.900">
              <Avatar.Image src={currentUserDetails?.image} />
              <Avatar.Fallback name="avatar" />
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
              {t('roommate.homepage.leftbar.profile_settings')}
            </Button>

            <Button justifyContent="start" variant="ghost" size="lg">
              <IconHomeCog />
              {t('roommate.homepage.leftbar.apartment_settings')}
            </Button>

            <Button
              justifyContent="start"
              variant="ghost"
              size="lg"
              onClick={() => navigate({ to: '/roommate/residents' })}
            >
              <IconUsersGroup />
              {t('roommate.homepage.leftbar.roommates')}
            </Button>

              <Button
                justifyContent="start"
                variant="ghost"
                size="lg"
                onClick={() => navigate({ to: '/roommate/general-tasks' })}
              >
                <IconBellCog />
                {t('roommate.homepage.leftbar.notifications_settings')}
              </Button>

              <Button
                justifyContent="start"
                variant="ghost"
                size="lg"
                onClick={() => navigate({ to: '/roommate/general-shopping-lists' })}
              >
                <IconShoppingCart />
                {t('roommate.homepage.leftbar.shopping_templates')}
              </Button>

            <Button justifyContent="start" variant="ghost" size="lg">
              <IconSettings />
              {t('roommate.homepage.leftbar.app_settings')}
            </Button>

            <Button
              justifyContent="start"
              variant="ghost"
              size="lg"
              onClick={() => navigate({ to: '/select-apartment' })}
            >
              <IconHomeEdit />
              {t('roommate.homepage.leftbar.select_apartment')}
            </Button>
          </VStack>
          <Stack gap="4" alignItems="start">
            <LanguegeSelector />
            <Button justifyContent="start" variant="ghost" size="lg" onClick={logout}>
              <IconLogout />
              {t('roommate.homepage.leftbar.logout')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Sidebar>
  );
};