"use client";
import {
    Card,
    Field,
    Input,
    Stack,
    Button,
    Portal,
    Select,
    Flex,
    Box,
    Container,
    Heading
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { createListCollection } from "@chakra-ui/react"; // Ensure this is the correct library for ListCollection
import { useIsRTL } from "../../hooks/useIsRTL";
import { useTranslation } from "react-i18next";


const roomates = ["Tom", "Shani", "Noam", "Adi", "Liad"];

const roomatesCollection = createListCollection({
    items: [
        { value: "Tom" },
        { value: "Shani" },
        { value: "Noam" },
        { value: "Adi" },
        { value: "Liad" },
    ],
});

export const NewTaskTest = () => {
    const { isRTL } = useIsRTL();
    const { t } = useTranslation()



    return (
        <Container maxW="lg" p={8}>
            <Stack gap={6}>
                <Heading size="lg" textAlign="center">
                    {t('incidents.create_incident')}
                </Heading>

                {/* Chakra Menu: Menu + MenuButton + MenuList + MenuItem */}

                <Box p={4} borderWidth={1} borderRadius="xl" bg="white" maxW={"lg"} maxH={"100vh"}>
                    <Stack gap={4}>
                        {/* Wrap MenuList in Portal so it renders at document.body */}
                        <Select.Root collection={roomatesCollection}>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {/* TODO add API call to get all users and list them as MenuItem */}
                                        {roomatesCollection.items.map((roomate, i) => (
                                            <Select.Item item={roomate} key={i}>
                                                <Flex alignItems={'center'} gap={2}>
                                                    <Box backgroundColor={"white"} borderRadius="full" h={4} w={4} />
                                                    {roomate.value}
                                                </Flex>
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
}