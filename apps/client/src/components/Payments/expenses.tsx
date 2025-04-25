import { Box, Card, Container, Flex, For, SkeletonText, Stack } from "@chakra-ui/react"
import { useTranslation } from "react-i18next";
import { useApartmentExpenses } from "../../hooks/useApartmentExpenses";

const Expenses = () => {

    const { t } = useTranslation();

    const { data, isLoading, isError } = useApartmentExpenses('60514c72-5b94-417f-b4a3-9da2092a267f', '9ebd215a-8101-4a5a-96c3-04016aabcd1b');

    const dataPerMonth = data?.apartmentExpenses.reduce((acc: { [key: string]: any[] }, item) => {
        const month = new Date(item.expense_createdAt).toLocaleString('default', { month: 'numeric', year: 'numeric' });
        if (!acc[month]) {
            acc[month] = [];
        }
        acc[month].push(item);
        return acc;
    }, {}) || {};

    return (
        <Flex gap="2" direction="column" width="100%">
            {isLoading || !data ? (
                <SkeletonText noOfLines={1} width="50%" mb="2" />
            ) : (
                <For each={Object.entries(dataPerMonth)} fallback={<SkeletonText noOfLines={1} width="50%" mb="2" />}>
                    {([month, expenses]) => (
                        <Box key={month} mb={6}>
                            <Box fontSize="l" fontWeight="bold" mb={2}>
                                {(t(`months.${month.split("/")[0]}` as any) as string)} {month.split('/')[1]}
                            </Box>
                            <Stack gap={3}>
                                <For each={expenses}>
                                    {(item) => (
                                        <Card.Root width="100%" key={item.expense_expenseId}>
                                            <Card.Body gap="2" p={4}>
                                                <Flex gap="2" alignItems="center" justifyContent="space-between">
                                                    <Flex direction="column">
                                                        <Card.Title>{item.expense_description}</Card.Title>
                                                        <Card.Description as="div">
                                                            {item.paidByMe
                                                                ? t("payments.you-paid", { amount: item.expense_amount })
                                                                : t("payments.paid-by", {
                                                                    amount: item.expense_amount,
                                                                    name: `${item.paidByFirstName} ${item.paidByLastName[0]}`,
                                                                })}
                                                        </Card.Description>
                                                    </Flex>
                                                    <Card.Description
                                                        as="div"
                                                        whiteSpace="pre-line"
                                                        textAlign="end"
                                                        color={item.paidByMe ? "green.600" : "red.600"}
                                                    >
                                                        {item.paidByMe
                                                            ? t("payments.you-lent", { amount: item.expense_amount - Number(item.splitAmount) })
                                                            : t("payments.you-borrowed", { amount: item.splitAmount })}
                                                    </Card.Description>
                                                </Flex>
                                            </Card.Body>
                                        </Card.Root>
                                    )}
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