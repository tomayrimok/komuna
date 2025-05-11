import { Box, Flex, For, SkeletonText, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ApartmentExpense } from "../../api/apartmentExpenses";
import { useAuth } from "../../context/auth/AuthProvider";
import { useApartmentExpenses } from "../../hooks/useApartmentExpenses";
import ExpenseCard from "./expenseCard";

const Expenses = () => {

    const { t } = useTranslation();
    const { currentUserDetails } = useAuth();
    const { data, isLoading, isError } = useApartmentExpenses(currentUserDetails!.userId);

    const dataPerMonth = data?.apartmentExpenses.reduce((acc: { [key: string]: ApartmentExpense[] }, item) => {
        const month = new Date(item.expense_createdAt).toLocaleString('default', { month: 'numeric', year: 'numeric' });
        if (!acc[month]) {
            acc[month] = [];
        }
        acc[month].push(item);
        return acc;
    }, {}) || {};

    return (
        <Flex gap="2" direction="column" width="100%">
            {isLoading && <SkeletonText noOfLines={1} width="50%" mb="2" />}
            {data && (
                !data.apartmentExpenses.length ?
                    <Text fontSize="l" fontWeight="bold" mb={2}>
                        {t("payments.expense.no-expenses")}
                    </Text>
                    :
                    <For each={Object.entries(dataPerMonth)} fallback={<SkeletonText noOfLines={1} width="50%" mb="2" />}>
                        {([month, expenses]) => (
                            <Box key={month} mb={6}>
                                <Box fontSize="l" mb={2} color={"gray.600"}>
                                    {(t(`months.${month.split("/")[0]}` as any) as string)} {month.split('/')[1]}
                                </Box>
                                <Stack gap={3}>
                                    <For each={expenses}>
                                        {(item) => <ExpenseCard item={item} />}
                                    </For>
                                </Stack>
                            </Box>
                        )}
                    </For>
            )}
        </Flex>
    )
}

export default Expenses