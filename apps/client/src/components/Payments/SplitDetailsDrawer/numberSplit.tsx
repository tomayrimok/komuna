import { Flex, NumberInput, Text } from "@chakra-ui/react";
import UserCard from "../../General/userCard";
import { useExpense } from "../../../context/payments/ExpenseProvider";
import { useTranslation } from "react-i18next";

interface NumberSplitProps {
    setUserFixedAmount: (userId: string, amount: number) => void;
}

const NumberSplit: React.FC<NumberSplitProps> = ({ setUserFixedAmount }) => {

    const { users, usersFixedAmounts } = useExpense();
    const { t } = useTranslation();

    return (
        <>
            <Text fontSize="lg" mb={6} textAlign="center">
                {t('payments.expense.split-by-amount-title')}
            </Text>
            <Flex direction="column" gap={2} mt={2}>
                {users.map(user => user && (
                    <UserCard
                        key={user.userId}
                        user={user}
                        additionalComponent={
                            <Flex alignItems={"center"} gap={3} me={1}>
                                <NumberInput.Root
                                    defaultValue={String(usersFixedAmounts[user.userId] ?? 0)}
                                    onValueChange={e => setUserFixedAmount(user.userId, Number(e.value))}
                                    maxW="200px"
                                    min={0}
                                >
                                    <NumberInput.Control />
                                    <NumberInput.Input placeholder="0.00" />
                                </NumberInput.Root>
                                <Text fontSize="xl" >
                                    ₪
                                </Text>
                            </Flex>
                        }
                    />
                ))}
            </Flex>
        </>
    );
};
export default NumberSplit;
