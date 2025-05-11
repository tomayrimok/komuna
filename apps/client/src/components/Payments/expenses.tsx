import { Box, Card, Flex, For, Icon, SkeletonText, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LuChevronLeft } from "react-icons/lu";
import { useAuth } from "../../context/auth/AuthProvider";
import { useApartmentExpenses } from "../../hooks/useApartmentExpenses";
import { useLocaleChange } from "../../hooks/useLocaleChange";
import { roundUpToXDigits } from "../../utilities/roundUpToXDigits";

const Expenses = () => {

    const { t } = useTranslation();
    const { currentUserDetails } = useAuth();

    const { data, isLoading, isError } = useApartmentExpenses(currentUserDetails!.userId);
    const navigate = useNavigate();
    const { isRTL } = useLocaleChange();

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
                                <Box fontSize="l" fontWeight="bold" mb={2}>
                                    {(t(`months.${month.split("/")[0]}` as any) as string)} {month.split('/')[1]}
                                </Box>
                                <Stack gap={3}>
                                    <For each={expenses}>
                                        {(item) => (
                                            <Card.Root
                                                cursor={"pointer"}
                                                onClick={() => navigate({ to: `/roommate/payments/expenses/${item.expense_expenseId}` })}
                                                width="100%"
                                                key={item.expense_expenseId}
                                            >
                                                <Card.Body p={4}>
                                                    <Flex gap="3" alignItems="center" justifyContent="space-between">
                                                        <Flex direction="column" flexGrow={1}>
                                                            <Card.Title>{item.expense_description}</Card.Title>
                                                            <Card.Description as="div">
                                                                {item.paidByMe
                                                                    ? t("payments.you-paid", { amount: roundUpToXDigits(item.expense_amount) })
                                                                    : t("payments.paid-by", {
                                                                        amount: roundUpToXDigits(item.expense_amount),
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
                                                                ? t("payments.you-lent", { amount: roundUpToXDigits(item.expense_amount - Number(item.splitAmount)) })
                                                                : t("payments.you-borrowed", { amount: roundUpToXDigits(item.splitAmount) })
                                                            }
                                                        </Card.Description>
                                                        {/* <IconButton variant={"surface"} onClick={() => navigate({ to: `/roommate/payments/expenses/${item.expense_expenseId}` })} aria-label="Edit" size="sm" colorScheme="blue">
                                                        <LuPencil />
                                                    </IconButton> */}
                                                        <Icon rotate={isRTL ? "unset" : "180deg"}>
                                                            <LuChevronLeft />
                                                        </Icon>
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