import { Box, Flex, For, Icon, Image, SkeletonText, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/auth/AuthProvider";
import { useApartmentExpenses } from "../../hooks/useApartmentExpenses";
import { groupBy } from 'lodash';
import { format, parseISO } from 'date-fns';

import ExpenseCard from "./expenseCard";

const Expenses = () => {
    const { t } = useTranslation();
    const { currentUserDetails } = useAuth();
    const { data, isLoading } = useApartmentExpenses(currentUserDetails!.userId);

    const dataPerMonth = data?.apartmentExpenses
        ? groupBy(data.apartmentExpenses, (item) =>
            format(parseISO(item.expense_createdAt), 'M/yyyy')
        )
        : {};

    return (
        <Flex gap="2" direction="column" width="100%" p={6} pb={11}>
            {isLoading && <SkeletonText noOfLines={1} width="50%" mb="2" />}
            {data && (
                !data.apartmentExpenses?.length ? (
                    <Flex
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        mt="15vh"
                    >
                        <Image src="/meerkats/campfire.png" width="50vw" />
                        <Text fontSize="xl" fontWeight="bold" mb={2}>
                            {t("payments.expense.no-expenses")}
                        </Text>
                    </Flex>
                ) : (
                    <For each={Object.entries(dataPerMonth)} fallback={<SkeletonText noOfLines={1} width="50%" mb="2" />}>
                        {([month, expenses]) => {
                            const [monthNum, year] = month.split("/");
                            return (
                                <Box key={month} mb={6}>
                                    <Box fontWeight={"bold"} fontSize="l" mb={2} color="gray.600">
                                        {t(`months.${monthNum}` as any)} {year}
                                    </Box>
                                    <Stack gap={2}>
                                        <For each={expenses}>
                                            {(item) => <ExpenseCard key={item.expense_expenseId} item={item} />}
                                        </For>
                                    </Stack>
                                </Box>
                            );
                        }}
                    </For>
                )
            )}
        </Flex>
    );
};

export default Expenses;
