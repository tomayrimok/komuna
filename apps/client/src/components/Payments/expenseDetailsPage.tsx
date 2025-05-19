import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Input,
    NumberInput,
    Stack,
    Text
} from "@chakra-ui/react";
import { ExpenseProvider, useExpense } from "../../context/payments/ExpenseProvider";
import { withWrappers } from "../../utilities/withWrappers";
import { useRouter } from "@tanstack/react-router";
import SelectUserDrawer from "../General/selectResidentDrawer";
import SplitDetailsDrawer from "./SplitDetailsDrawer/splitDetailsDrawer";
import { useTranslation } from "react-i18next";

const ExpenseDetailsPage = () => {
    const {
        expenseDetails,
        setAmount,
        areSplitsValuesEqual,
        setPaidBy,
        setDescription,
        handleSave,
        expenseId,
        isExpenseDetailsLoading
    } = useExpense();

    const router = useRouter();
    const { t } = useTranslation();

    if (expenseId && isExpenseDetailsLoading) return <Text>Loading...</Text>;

    return (
        <Container maxW="lg" py={8}>
            <Stack gap={6}>
                <Heading size="lg" textAlign="center">
                    {expenseId ? t("payments.expense.edit-expense") : t("payments.expense.create-expense")}
                </Heading>

                <Box p={4} borderWidth={1} borderRadius="xl" boxShadow="sm" bg="white">
                    <Stack gap={4}>
                        <Box>
                            <Text mb={1} fontWeight="medium">
                                {t("payments.expense.expense-description")}
                            </Text>
                            <Input
                                placeholder={t("payments.expense.expense-description")}
                                value={expenseDetails.description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Box>

                        <Box>
                            <Text mb={1} fontWeight="medium">
                                {t("payments.expense.expense-amount")}
                            </Text>
                            <Flex alignItems="center" gap={2}>
                                <NumberInput.Root
                                    maxW="200px"
                                    onValueChange={(e) => setAmount(Number(e.value))}
                                    value={String(expenseDetails.amount)}
                                >
                                    <NumberInput.Control />
                                    <NumberInput.Input placeholder="0.00" />
                                </NumberInput.Root>
                                <Text fontSize="xl" >
                                    ₪
                                </Text>
                            </Flex>
                        </Box>

                        <hr />
                        <Flex alignItems="center" gap={2} flexWrap="wrap">
                            <Text>
                                {t("payments.expense.paid-by")}
                            </Text>
                            <SelectUserDrawer
                                size={"lg"}
                                title={t("payments.expense.select-paid-by")}
                                onSelect={setPaidBy}
                                trigger={
                                    <Button size="sm" px={1} py={0} h="unset" variant={"surface"}>
                                        {expenseDetails.paidByUser?.firstName} {expenseDetails.paidByUser?.lastName}
                                    </Button>
                                }
                            />
                            <Text>
                                {t("payments.expense.and-splits")}
                            </Text>
                            <SplitDetailsDrawer
                                trigger={
                                    <Button size="sm" px={1} py={0} h="unset" variant={"surface"}>
                                        {areSplitsValuesEqual ? t("payments.expense.equally") : t("payments.expense.unequally")}
                                    </Button>
                                }
                            />
                        </Flex>
                    </Stack>
                </Box>

                <Flex justifyContent="space-between" gap={3}>
                    <Button variant="outline" onClick={() => router.history.back()}>
                        {t("cancel")}
                    </Button>
                    <Button colorScheme="blue" onClick={handleSave}>
                        {t("save")}
                    </Button>
                    {/* {expenseId &&
                        <Button colorScheme="red" variant="ghost" onClick={handleDelete}>
                            מחיקת הוצאה
                        </Button>
                    } */}
                </Flex>
            </Stack>
        </Container>
    );
};

export default withWrappers(ExpenseDetailsPage, [ExpenseProvider]);
