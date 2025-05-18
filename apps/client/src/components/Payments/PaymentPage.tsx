import { Box, Flex, Stack, Text } from "@chakra-ui/react"
import BalanceCard from "./balanceCard";
import Expenses from "./expenses";
import CreateExpenseButton from "./createExpenseButton";
import { useTranslation } from "react-i18next";

const PaymentPage = () => {

    const { t } = useTranslation();

    return (
        <Stack
            gap="4"
            direction="row"
            wrap="wrap"
        >
            <BalanceCard />
            <Box divideY={"1px"} width={"full"}>
                <Box p={6}>
                    <CreateExpenseButton />
                    <Expenses />
                </Box>

            </Box>

        </Stack>
    )
}

export default PaymentPage