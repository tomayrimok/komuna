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

    if (expenseId && isExpenseDetailsLoading) return <Text>Loading...</Text>;

    return (
        <Container maxW="lg" py={8}>
            <Stack gap={6}>
                <Heading size="lg" textAlign="center">
                    {expenseId ? "עריכת הוצאה" : "יצירת הוצאה חדשה"}
                </Heading>

                <Box p={4} borderWidth={1} borderRadius="xl" boxShadow="sm" bg="white">
                    <Stack gap={4}>
                        <Box>
                            <Text mb={1} fontWeight="medium">תיאור ההוצאה</Text>
                            <Input
                                placeholder="Description"
                                value={expenseDetails.description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Box>

                        <Box>
                            <Text mb={1} fontWeight="medium">סכום ההוצאה</Text>
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
                            <Text>שולם על ידי</Text>
                            <SelectUserDrawer
                                onSelect={setPaidBy}
                                trigger={
                                    <Button size="sm" px={1} py={0} h="unset" variant={"surface"}>
                                        {expenseDetails.paidByUser?.firstName} {expenseDetails.paidByUser?.lastName}
                                    </Button>
                                }
                            />
                            <Text>ומתחלק</Text>
                            <SplitDetailsDrawer
                                trigger={
                                    <Button size="sm" px={1} py={0} h="unset" variant={"surface"}>
                                        {areSplitsValuesEqual ? "בצורה שווה" : "בצורה לא שווה"}
                                    </Button>
                                }
                            />
                        </Flex>
                    </Stack>
                </Box>

                <Flex justifyContent="space-between" gap={3}>
                    <Button variant="outline" onClick={() => router.history.back()}>
                        ביטול
                    </Button>
                    <Button colorScheme="blue" onClick={handleSave}>
                        שמירה
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
