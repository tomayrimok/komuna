import { Avatar, Box, Button, Card, Container, Flex, For, Skeleton, SkeletonText, Stack } from "@chakra-ui/react"
import { useTranslation } from "react-i18next";
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { BalanceDetails } from "../../api/userBalanceDetails";
import BalanceCard from "./balanceCard";
import { useApartmentExpenses } from "../../hooks/useApartmentExpenses";

const PaymentPage = () => {

    const { t } = useTranslation();

    const { data, isLoading, isError } = useApartmentExpenses('60514c72-5b94-417f-b4a3-9da2092a267f', '9ebd215a-8101-4a5a-96c3-04016aabcd1b');
    // const isLoading = true;

    return (
        <Container p={8} maxW="container.xl">
            <Stack gap="4" direction="row" wrap="wrap">
                <BalanceCard />
                <Flex gap="4" direction="column" width="100%">
                    <Card.Root width="100%" >
                        <Card.Body gap="2">
                            <Card.Title mb="2">

                            </Card.Title>
                            <Card.Description as={"div"}>

                            </Card.Description>
                        </Card.Body>
                    </Card.Root>

                </Flex>

            </Stack>
        </Container>

    )
}

export default PaymentPage