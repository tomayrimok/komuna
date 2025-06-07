import { Box, Flex, VStack, IconButton, Text } from '@chakra-ui/react';
import {
    IconHome,
    IconHeadphones,
    IconMessageCircleExclamation,
    IconSettings,
} from '@tabler/icons-react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useIsRTL } from '../../hooks/useIsRTL';

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

const LandlordBottomNav = () => {
    const { t } = useTranslation();
    const { dir } = useIsRTL();
    return (
        <Box background="white" w="100%" h="97px" zIndex="1" dir={dir} boxShadow="2xl">
            <Flex justify="space-around" align="center" h="100%" position="relative" zIndex="1">
                <NavItem icon={IconSettings} label={t('landlord.homepage.navigation.settings')} route="/landlord/settings" />
                <NavItem icon={IconHome} label={t('landlord.homepage.navigation.home')} route="/landlord" />
                <NavItem
                    icon={IconMessageCircleExclamation}
                    label={t('landlord.homepage.navigation.incidents')}
                    route="/landlord/incidents"
                />
            </Flex>
        </Box>
    );
};

export default LandlordBottomNav;
