import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Text,
    VStack,
    HStack,
    IconButton,
} from '@chakra-ui/react';
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface FeatureSlide {
    id: string;
    title: string;
    description: string;
    emoji: string;
    bgColor: string;
    textColor: string;
}

const getFeatures = (t: any): FeatureSlide[] => [
    {
        id: 'tasks',
        title: t('onboarding.smart_task_management.title'),
        description: t('onboarding.smart_task_management.description'),
        emoji: '🎯',
        bgColor: 'green.50',
        textColor: 'green.700',
    },
    {
        id: 'expenses',
        title: t('onboarding.professional_expense_management.title'),
        description: t('onboarding.professional_expense_management.description'),
        emoji: '💰',
        bgColor: 'yellow.50',
        textColor: 'yellow.700',
    },
    {
        id: 'incidents',
        title: t('onboarding.quick_incident_reporting.title'),
        description: t('onboarding.quick_incident_reporting.description'),
        emoji: '🛠️',
        bgColor: 'red.50',
        textColor: 'red.700',
    },
    {
        id: 'shopping',
        title: t('onboarding.shared_shopping_lists.title'),
        description: t('onboarding.shared_shopping_lists.description'),
        emoji: '🛒',
        bgColor: 'blue.50',
        textColor: 'blue.700',
    },
    {
        id: 'communication',
        title: t('onboarding.smooth_communication.title'),
        description: t('onboarding.smooth_communication.description'),
        emoji: '💬',
        bgColor: 'purple.50',
        textColor: 'purple.700',
    },
];

interface FeatureOnboardingProps {
    onComplete: () => void;
    onSkip: () => void;
}

const FeatureOnboarding: React.FC<FeatureOnboardingProps> = ({ onComplete, onSkip }) => {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    const features = getFeatures(t);

    const nextSlide = () => {
        if (currentSlide < features.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            onComplete();
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const progress = ((currentSlide + 1) / features.length) * 100;
    const currentFeature = features[currentSlide];

    return (
        <Box
            minH="100vh"
            bg={currentFeature.bgColor}
            transition="background-color 0.5s ease"
            position="relative"
            overflow="hidden"
        >
            {/* Background Pattern */}
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bgImage={`url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='30' y='60' font-size='80' fill='rgba(255,255,255,0.1)' transform='rotate(15)'%3E${encodeURIComponent(currentFeature.emoji)}%3C/text%3E%3C/svg%3E")`}
                bgRepeat="repeat"
                opacity={0.3}
            />

            {/* Skip Button */}
            <Box position="absolute" top={4} right={4} zIndex={10}>
                <IconButton
                    onClick={onSkip}
                    variant="ghost"
                    size="lg"
                    color="gray.600"
                    _hover={{ bg: 'white', color: 'gray.800' }}
                >
                    <IconX />
                </IconButton>
            </Box>

            {/* Progress Bar */}
            <Box position="absolute" top={0} left={0} right={0} zIndex={5}>
                <Box
                    h="4px"
                    bg="rgba(255,255,255,0.3)"
                    borderRadius="full"
                >
                    <Box
                        h="full"
                        bg={currentFeature.textColor}
                        borderRadius="full"
                        w={`${progress}%`}
                        transition="width 0.5s ease"
                    />
                </Box>
            </Box>

            <Container maxW="lg" h="100vh" display="flex" flexDirection="column" justifyContent="center" p={8}>
                <VStack gap={8} textAlign="center" position="relative" zIndex={5} h="full">
                    <Flex flexGrow={1} justifyContent="center" alignItems="center">
                        <Box
                            bg="white"
                            borderRadius="3xl"
                            p={8}
                            shadow="2xl"
                            maxW="md"
                            mx="auto"
                        // transform={`translateX(${(currentSlide - 2) * 20}px)`}
                        // transition="all 0.5s ease"
                        >
                            <Box
                                fontSize="6xl"
                                mb={6}
                                height="120px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {currentFeature.emoji}
                            </Box>

                            <Heading
                                size="xl"
                                mb={4}
                                color={currentFeature.textColor}
                                fontWeight="bold"
                            >
                                {currentFeature.title}
                            </Heading>

                            <Text
                                fontSize="lg"
                                color="gray.600"
                                lineHeight="1.6"
                                px={4}
                            >
                                {currentFeature.description}
                            </Text>
                        </Box>
                    </Flex>

                    <HStack gap={3} mt={8}>
                        {features.map((_, index) => (
                            <Box
                                key={index}
                                w={3}
                                h={3}
                                borderRadius="full"
                                shadow="xs"
                                bg={index === currentSlide ? currentFeature.textColor : 'white'}
                                cursor="pointer"
                                onClick={() => goToSlide(index)}
                                transition="all 0.3s ease"
                                _hover={{
                                    bg: index === currentSlide ? currentFeature.textColor : 'rgba(255,255,255,0.8)',
                                }}
                            />
                        ))}
                    </HStack>

                    <HStack gap={4} mt={"auto"} w="full" justify="space-between" maxW="md">
                        <Button
                            onClick={prevSlide}
                            variant="ghost"
                            size="lg"
                            disabled={currentSlide === 0}
                            color="gray.600"
                            _hover={{ bg: 'white', color: 'gray.800' }}
                            opacity={currentSlide === 0 ? 0.5 : 1}
                        >
                            <Flex alignItems="center" gap={2}>
                                <IconChevronRight />
                                {t('common.previous')}
                            </Flex>
                        </Button>

                        <Button
                            onClick={nextSlide}
                            size="lg"
                            colorScheme={currentFeature.textColor.split('.')[0] as any}
                            bg={currentFeature.textColor}
                            color="white"
                            _hover={{
                                bg: currentFeature.textColor,
                                opacity: 0.9,
                                transform: 'translateY(-2px)',
                            }}
                            shadow="lg"
                            px={4}
                        >
                            <Flex alignItems="center" gap={2}>
                                {currentSlide === features.length - 1 ? t('common.lets_start') : t('common.next')}
                                <IconChevronLeft />
                            </Flex>
                        </Button>
                    </HStack>


                </VStack>
            </Container>
        </Box>
    );
};

export default FeatureOnboarding; 