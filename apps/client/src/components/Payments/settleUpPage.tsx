import { Avatar, Box, Button, Card, Flex, For, SkeletonText, Stack, Text } from "@chakra-ui/react"
import { useTranslation } from "react-i18next";
import { useUserBalanceDetails } from "../../hooks/useUserBalanceDetails";
import { useNavigate } from "@tanstack/react-router";
import UserCard from "../General/userCard";

const SettleUpPage = () => {

    const { t } = useTranslation();
    const { data, isLoading, isError } = useUserBalanceDetails('60514c72-5b94-417f-b4a3-9da2092a267f', '9ebd215a-8101-4a5a-96c3-04016aabcd1b');
    const navigate = useNavigate();

    return (
        <Card.Root width="100%">
            <Card.Body gap="2">
                <Card.Title mb="2">
                    {t('payments.settle-up-title')}
                </Card.Title>
                <Card.Description as={"div"}>
                    {!isLoading && data ?
                        <Flex direction="column" gap="3">
                            <For each={data.balanceDetails}>
                                {(item) => (
                                    <UserCard
                                        key={item.debt_debtId}
                                        user={item.debtor ?
                                            {
                                                firstName: item.userTo_firstName,
                                                lastName: item.userTo_lastName,
                                                image: item.userTo_image,
                                                phoneNumber: item.userTo_phoneNumber
                                            } :
                                            {
                                                firstName: item.userFrom_firstName,
                                                lastName: item.userFrom_lastName,
                                                image: item.userFrom_image,
                                                phoneNumber: item.userFrom_phoneNumber
                                            }
                                        }
                                        additionalComponent={
                                            <Text whiteSpace={"pre-line"} textAlign="end" color={item.debtor ? "red.600" : "green.600"}>
                                                {item.debtor ?
                                                    t('payments.you-owe', { amount: item.debt_amount }) :
                                                    t('payments.owe-you', { amount: item.debt_amount })
                                                }
                                            </Text>
                                        }
                                        onClick={() => {
                                            navigate({ to: '/roommate/payments/settle-up/' + item.debt_debtId })
                                        }}

                                    />
                                )}
                            </For>
                        </Flex>
                        :
                        <SkeletonText noOfLines={2} width="100%" />
                    }
                </Card.Description>
            </Card.Body>
        </Card.Root>
    )
}

export default SettleUpPage