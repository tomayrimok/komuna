import { Button, Container, Flex, Input, NumberInput, Text } from "@chakra-ui/react";
import { useState } from "react";
import SelectUserDrawer from "../General/selectResidentDrawer";
import SplitDetailsDrawer from "./SplitDetailsDrawer/splitDetailsDrawer";
import { User } from "@komuna/types"
import { ExpenseProvider, useExpense } from "../../context/payments/ExpenseProvider";
import { withWrappers } from "../../utilities/withWrappers";

const CreateExpensePage = () => {

    const { amount, setAmount, areSplitsValuesEqual, payedBy, setPayedBy, description, setDescription } = useExpense();

    return (
        <Container>
            <Text>
                Create Expense Page
            </Text>

            <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

            <Flex direction="row" gap="2" alignItems="center">
                <NumberInput.Root
                    maxW="200px"
                    onValueChange={(e) => setAmount(Number(e.value))}
                >
                    <NumberInput.Control />
                    <NumberInput.Input placeholder="0.00" />
                </NumberInput.Root>
                <Text fontSize="xl" >
                    ₪
                </Text>
            </Flex>
            <Flex direction="row" gap="2" alignItems="center">
                <Text>
                    שולם על ידי
                </Text>
                <SelectUserDrawer
                    onSelect={(userId) => setPayedBy(userId)}
                    trigger={
                        <Button px={1} py={0} h="unset" variant={"surface"}>
                            {payedBy?.firstName} {payedBy?.lastName}
                        </Button>
                    }
                />
                <Text>
                    ומתחלק
                </Text>
                <SplitDetailsDrawer
                    amount={amount}
                    onSelect={(splits) => { }}
                    trigger={<Button px={1} py={0} h="unset" variant={"surface"}>
                        {areSplitsValuesEqual ? 'בצורה שווה' : 'בצורה לא שווה'}
                    </Button>}
                />
            </Flex>
        </Container>
    );
}
export default withWrappers(CreateExpensePage, [ExpenseProvider])