import { Box, Button, Card, For, FormatNumber, SkeletonText, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/auth/AuthProvider";
import { useUserBalanceDetails } from "../../hooks/useUserBalanceDetails";
import { roundUpToXDigits } from "../../utilities/roundUpToXDigits";
import { API } from "@komuna/types";
import { useIncidents } from "../../hooks/query/useIncidents";

const IncidentsHeader = () => {


    const isLoading = false; // Replace with actual loading state

    const { sessionDetails: { apartmentId } } = useAuth();

    const { data } = useIncidents();

    return (
        <Box
            width="full"
            height={"23vh"}
            position={"relative"}
            overflow={"hidden"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <Box
                minW={"120vw"}
                height={"120vw"}
                borderRadius="50%"
                bg="brand.500"
                position={"absolute"}
                bottom={0}
                right={"-10vw"}
                zIndex={-1}

            />
            {!isLoading && data ?
                <>
                    <Text fontWeight={"bold"} fontSize="lg">
                        יש איקס תקלות פתוחות
                    </Text>

                </>
                :
                <SkeletonText noOfLines={2} width="50%" m="auto" mb="2" />
            }


        </Box>

    )
}

export default IncidentsHeader