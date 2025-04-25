import { Stack } from "@chakra-ui/react"
import BalanceCard from "./balanceCard";
import Expenses from "./expenses";

const PaymentPage = () => {

    return (
        <Stack gap="4" direction="row" wrap="wrap" width={"100%"} >
            <BalanceCard />
            <Expenses />
        </Stack>
    )
}

export default PaymentPage