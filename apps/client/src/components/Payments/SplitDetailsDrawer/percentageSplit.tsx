import { Flex, NumberInput, Text } from "@chakra-ui/react";
import UserCard from "../../General/userCard";
import { useExpense } from "../../../context/payments/ExpenseProvider";
import { roundUpToXDigits } from "../../../utilities/roundUpToXDigits";
import { useTranslation } from "react-i18next";

interface PercentageSplitProps {
    setUserPercentage: (userId: string, percentage: number) => void;
}

const PercentageSplit: React.FC<PercentageSplitProps> = ({ setUserPercentage }) => {

    const { users, usersPercentage, selectedUserIds } = useExpense();
    const { t } = useTranslation();

    return (
        <>
            <Text fontSize="lg" mb={6} textAlign="center">
                {t('payments.expense.split-by-percentage-title')}
            </Text>
            <Flex direction="column" gap={2} mt={2}>
                {users.map(user => user && (
                    <UserCard
                        key={user.userId}
                        user={user}
                        additionalComponent={
                            <Flex alignItems={"center"} gap={3} me={1}>
                                <NumberInput.Root
                                    defaultValue={String(usersPercentage[user.userId] ?? 0)}
                                    onValueChange={e => setUserPercentage(user.userId, Number(e.value))}
                                    maxW="200px"
                                    min={0}
                                    max={100}
                                >
                                    <NumberInput.Control />
                                    <NumberInput.Input placeholder={roundUpToXDigits(100 / selectedUserIds.size) + "%"} />
                                </NumberInput.Root>
                                <Text fontSize="xl" >
                                    %
                                </Text>
                            </Flex>
                        }
                    />
                ))}
            </Flex>
        </>
    );
};
export default PercentageSplit;
