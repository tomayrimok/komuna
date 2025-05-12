import { Box, Flex, VStack, IconButton, Text } from '@chakra-ui/react';
import {
  IconHome,
  IconListCheck,
  IconCoins,
  IconShoppingCart,
  IconHeadphones,
  IconMessageCircleExclamation,
} from '@tabler/icons-react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

const NavItem = ({ icon: Icon, label, route }: { icon: typeof IconHeadphones; label: string; route: string }) => {
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });

  const isActive = location.href === route;

  return (
    <VStack padding="1" gap="0" cursor="pointer" onClick={() => navigate({ to: route })}>
      <IconButton
        aria-label={label}
        variant={isActive ? 'solid' : 'ghost'}
        size="xl"
        rounded="full"
        color={isActive ? 'brand:900' : 'brand.900'}
      >
        <Icon size={24} />
      </IconButton>
      <Text fontSize="sm" color="brand.900">
        {label}
      </Text>
    </VStack>
  );
};

const RoommateBottomNav = () => {
  const { t } = useTranslation();
  return (
    <Box background="white" pos="fixed" bottom="0" w="100%" h="97px" zIndex="1" dir="rtl" boxShadow="2xl">
      <Flex justify="space-around" align="center" h="100%" position="relative" zIndex="1">
        <NavItem icon={IconListCheck} label={t('roommate.homepage.navigation.tasks')} route="/roommate/tasks" />
        <NavItem icon={IconCoins} label={t('roommate.homepage.navigation.payments')} route="/roommate/payments" />
        <NavItem icon={IconHome} label={t('roommate.homepage.navigation.home')} route="/roommate" />
        <NavItem
          icon={IconShoppingCart}
          label={t('roommate.homepage.navigation.shopping')}
          route="/roommate/shopping"
        />
        <NavItem
          icon={IconMessageCircleExclamation}
          label={t('roommate.homepage.navigation.incidents')}
          route="/roommate/incidents"
        />
      </Flex>
    </Box>
  );
};

export default RoommateBottomNav;
