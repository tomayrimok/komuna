import { Stack } from "@chakra-ui/react"
import BalanceCard from "./balanceCard";
import Expenses from "./expenses";
import CreateExpenseButton from "./createExpenseButton";

const PaymentPage = () => {

    return (
        <Stack
            paddingY="44px"
            paddingX="25px"
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