import { Box, Button, CardRoot, Clipboard, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { useApartment } from "../../hooks/useApartment";
import { useTranslation } from "react-i18next";
import { UserRole } from "@komuna/types";
import { FC } from "react";

interface Code {
    role?: UserRole;
}

export const Codes: FC<Code> = ({ role }) => {

    const { data: apartment } = useApartment()
    const { t } = useTranslation()

    if (!apartment?.roommateCode && !apartment?.landlordCode) {
        return null
    }

    const codes = [
        {
            code: apartment?.roommateCode,
            description: t('create_apartment.share_apartment.roommate_code')
        },
        {
            code: apartment?.landlordCode,
            hidden: apartment?.landlordUserId,
            description: t('create_apartment.share_apartment.landlord_code')
        }
    ]

    const apartmentName = (role === UserRole.ROOMMATE && apartment?.name) ? apartment?.name : `${apartment?.address} ${apartment?.city}`

    return (
        <VStack w={"100%"} p={4} ps={6} backgroundColor={"brand.50"} borderRadius={"md"} alignItems={"start"} gap={0}>
            <Text mb={1} fontWeight={"bold"}>{apartmentName}</Text>
            {codes.map((code) => (
                !code.hidden && (
                    <HStack justifyContent={"space-between"} w={"100%"} key={code.description}>
                        <Text>{code.description}</Text>
                        <Flex alignItems={"center"}>
                            <Text fontWeight={"medium"} fontSize={"2xl"}>{code.code}</Text>
                            <Clipboard.Root value={code.code} height={'fit-content'}>
                                <Clipboard.Trigger asChild>
                                    <Button backgroundColor="transparent">
                                        <Clipboard.Indicator fontSize="xl" />
                                    </Button>
                                </Clipboard.Trigger>
                            </Clipboard.Root>
                        </Flex>
                    </HStack>
                )
            ))}
        </VStack>
    )
};      