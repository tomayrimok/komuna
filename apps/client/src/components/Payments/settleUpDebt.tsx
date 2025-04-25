import { useParams } from "@tanstack/react-router";
import { useDebtDetails } from "../../hooks/useDebtDetails";
import { Avatar, Button, Container, Field, Flex, Icon, Input, NumberInput, Text } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useCreatePayment } from "../../hooks/useCreatePayment";

export const SettleUpDebt = () => {

    const { debtId } = useParams({ from: '/roommate/payments/settle-up/$debtId' });
    const { mutate: createPayment } = useCreatePayment();
    const { data: debtDetails, isLoading, isError } = useDebtDetails(debtId);
    const { t } = useTranslation();
    const [value, setValue] = useState<number>();



    return (
        <div>
            {debtDetails && (
                <Flex direction="column" gap="3" alignItems={"center"}>
                    <Flex gap="3" alignItems="center">
                        <Avatar.Root size="2xl" shape="full">
                            <Avatar.Image src={debtDetails.userFrom_image} alt={debtDetails.userFrom_firstName} />
                            <Avatar.Fallback name={`${debtDetails.userFrom_firstName} ${debtDetails.userFrom_lastName}`} />
                        </Avatar.Root>
                        <Icon>
                            <LuArrowLeft size={30} />
                        </Icon>
                        <Avatar.Root size="2xl" shape="full">
                            <Avatar.Image src={debtDetails.userTo_image} alt={debtDetails.userTo_firstName} />
                            <Avatar.Fallback name={`${debtDetails.userTo_firstName} ${debtDetails.userTo_lastName}`} />
                        </Avatar.Root>
                    </Flex>
                    <Text fontSize="lg">
                        {t('payments.payment-made', { payer: debtDetails.userFrom_firstName, receiver: debtDetails.userTo_firstName })}
                    </Text>
                    <Text fontSize="md" color={"gray.500"}>
                        {t('payments.amount-prefix')}
                    </Text>
                    <Field.Root>
                        <Flex direction="row" gap="2" alignItems="center">

                            <NumberInput.Root
                                maxW="200px"
                                defaultValue={String(debtDetails.debt_amount)}
                                onValueChange={(e) => setValue(Number(e.value))}
                            >
                                <NumberInput.Control />
                                <NumberInput.Input />
                            </NumberInput.Root>
                            <Text fontSize="xl" >
                                ₪
                            </Text>
                        </Flex>
                    </Field.Root>
                    <Button
                        variant="solid"
                        colorScheme="blue"
                        size="lg"
                        onClick={() => createPayment({
                            amount: value ?? 0,
                            fromId: debtDetails.debt_fromId,
                            toId: debtDetails.debt_toId,
                            apartmentId: debtDetails.debt_apartmentId,
                        })}
                    >
                        {t('payments.settle-up')}
                    </Button>
                </Flex>
            )}
        </div>
    );
}