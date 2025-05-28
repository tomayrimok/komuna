import { Box, Button, HStack, Text, VStack, Image, Card } from '@chakra-ui/react';
import { useAuth } from '../../context/auth/AuthProvider';
import { LogoutButton } from '../../components/LogoutButton';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useIsRTL } from '../../hooks/useIsRTL';



export function TasksHome() {
    const { currentUserDetails } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();


    return (
        <Box backgroundColor="brand.500" flex="1" display="flex" flexDirection="column" gap="0">
            <HStack justifyContent="end" paddingX="2" paddingY="1">
                <LogoutButton />
            </HStack>
            <VStack
                paddingY="44px"
                paddingX="25px"
                backgroundColor="brand.10"
                flex="1"
                gap="16"
                borderRadius="88px"
                borderBottomEndRadius="none"
                borderBottomStartRadius="none"
            >
                <Text color="brand.900" fontSize="xl" fontWeight="bold">Your Tasks</Text>
                <Task />
            </VStack>
        </Box>
    );
}

export const Task = () => {
    const { currentUserDetails } = useAuth();


    return (
        <Box
            id='task'
            outline="3px ridge"
            borderRadius="2rem"
            outlineColor="brand.800"
            width="90%"
            backgroundColor="brand.500"
            display="flex"
            flexDirection="column"
            height="30vh"
        >
            <HStack>
                <Text>ASDJKB</Text>
            </HStack>
        </Box>
    );
}

/*
preview:
    title
    due date
    description

full:
    title
    due date
    description
    assigned to
    every...
*/