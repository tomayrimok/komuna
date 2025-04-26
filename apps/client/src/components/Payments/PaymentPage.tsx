import { Stack } from "@chakra-ui/react"
import BalanceCard from "./balanceCard";
import Expenses from "./expenses";
import CreateExpenseButton from "./createExpenseButton";

const PaymentPage = () => {

    return (
        <Stack gap="4" direction="row" wrap="wrap" width={"100%"} >
            <BalanceCard />
            <Expenses />
            <CreateExpenseButton />
        </Stack>
    )
}

export default PaymentPage