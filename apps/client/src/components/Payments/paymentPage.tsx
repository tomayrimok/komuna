import { Box, Flex, Stack, Text } from "@chakra-ui/react"
import BalanceCard from "./balanceCard";
import Expenses from "./expenses";
import CreateExpenseButton from "./createExpenseButton";
import { useTranslation } from "react-i18next";

const PaymentPage = () => {

    return (
        <Stack
            gap="4"
            direction="row"
            wrap="wrap"
        >
            <BalanceCard />
            <CreateExpenseButton />
            <Expenses />
        </Stack>
    )
}

export default PaymentPage
