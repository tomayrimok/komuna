import { Avatar, Box, Button, Card, Flex, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { Trans } from 'react-i18next';
import CreateIncidentButton from '../../components/Incidents/createIncidentButton';
import IncidentsNumber from '../../components/Incidents/incidentsNumber';
import { SettingLeftbar } from '../../components/SettingLeftbar';
import { useAuth } from '../../context/auth/AuthProvider';
import { useIsRTL } from '../../hooks/useIsRTL';
import { HomeCard } from '../../components/homeCard';
import { useNavigate } from '@tanstack/react-router';


export const LandlordHome = () => {
  const { currentUserDetails } = useAuth();
  const { isRTL } = useIsRTL();
  const navigate = useNavigate();

  const svgTransform = isRTL ? 'none' : 'scaleX(-1)';
  return (
    <Box flex="1" display="flex" flexDirection="column" gap="0">
      <svg
        style={{ transform: svgTransform }}
        xmlns="http://www.w3.org/2000/svg"
        width="344"
        height="112"
        viewBox="0 0 344 112"
        fill="none"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M205.163 -272.612C262.522 -266.189 262.518 -184.969 300.989 -144.497C334.919 -108.802 399.843 -100.847 412.494 -54.4955C426.964 -1.48369 413.284 64.2426 367.058 97.5591C322.545 129.641 261.119 98.8149 205.163 94.9355C156.44 91.5577 106.138 102.159 65.5248 76.6543C16.3321 45.7611 -3.03585 0.954487 1 -54.4955C4.97741 -109.143 41.6582 -130.604 83.3944 -168.862C124.165 -206.235 148.592 -278.946 205.163 -272.612Z"
          fill="hsl(35, 71%, 12%)"
        />
      </svg>
      <HStack width="100%" padding="5" position="absolute" top="0" right="0" justifyContent="space-between">
        <HStack>
          <Avatar.Root size="lg" shape="full" border="2px solid" borderColor="brand.900">
            <Avatar.Image src={currentUserDetails?.image} />
            <Avatar.Fallback name="Nue Camp" />
          </Avatar.Root>
          <Text color="white" fontSize="xl">
            <Trans
              i18nKey="roommate.homepage.title"
              values={{ firstName: currentUserDetails?.firstName }}
              components={{ b: <b /> }}
            />
          </Text>
        </HStack>
        <SettingLeftbar />
      </HStack>
      <VStack padding="5" gap="5">
        <HomeCard
          image={
            <Box
              fontSize="6xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={2}
            >
              ✨
            </Box>
          }
          text={<Text>גלו מה אתה יכולים לעשות עם קומונה</Text>}
          button={
            <Button
              colorScheme="purple"
              size="lg"
              borderRadius="xl"
              onClick={() => navigate({ to: '/onboarding/features' })}
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg'
              }}
              transition="all 0.2s"
            >
              צפו בהדרכה 🚀
            </Button>
          }
        />

        <HomeCard
          image={<Image src='/meerkats/incident.png' width={"20vw"} />}
          text={<IncidentsNumber />}
          button={<CreateIncidentButton isFixed={false} />}
        />
      </VStack>

    </Box >
  );
};
