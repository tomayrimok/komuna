import { Button, Container, Flex, Input, NumberInput, Text } from "@chakra-ui/react";
import { useState } from "react";
import SelectUserDrawer from "../General/selectResidentDrawer";
import SplitDetailsDrawer from "./SplitDetailsDrawer/splitDetailsDrawer";
import { User } from "@komuna/types"
import { ExpenseProvider, useExpense } from "../../context/payments/ExpenseProvider";
import { withWrappers } from "../../utilities/withWrappers";
import { useLocation, useNavigate, useParams, useRouter } from "@tanstack/react-router";
import { useExpenseDetails } from "../../hooks/useExpenseDetails";

const CreateExpensePage = () => {

    const { expenseDetails, setAmount, areSplitsValuesEqual, setPaidBy, setDescription, handleSave, expenseId } = useExpense();
    const router = useRouter();

    return (
        <Container>
            <Text>
                {expenseId ? "Edit Expense" : "Create Expense"}
            </Text>

            <Input placeholder="Description" value={expenseDetails.description} onChange={(e) => setDescription(e.target.value)} />

            <Flex direction="row" gap="2" alignItems="center">
                <NumberInput.Root
                    maxW="200px"
                    onValueChange={(e) => setAmount(Number(e.value))}
                >
                    <NumberInput.Control />
                    <NumberInput.Input placeholder="0.00" defaultValue={expenseDetails.amount} />
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
                    onSelect={(userId) => setPaidBy(userId)}
                    trigger={
                        <Button px={1} py={0} h="unset" variant={"surface"}>
                            {expenseDetails.paidByUser?.firstName} {expenseDetails.paidByUser?.lastName}
                        </Button>
                    }
                />
                <Text>
                    ומתחלק
                </Text>
                <SplitDetailsDrawer
                    trigger={
                        <Button px={1} py={0} h="unset" variant={"surface"}>
                            {areSplitsValuesEqual ? 'בצורה שווה' : 'בצורה לא שווה'}
                        </Button>
                    }
                />
            </Flex>
            <Flex direction="row" gap="2" alignItems="center">
                <Button variant="outline" onClick={() => router.history.back()}>
                    ביטול
                </Button>
                <Button onClick={handleSave}>
                    שמירה
                </Button>
            </Flex>
        </Container>
    );
}
export default withWrappers(CreateExpensePage, [ExpenseProvider])