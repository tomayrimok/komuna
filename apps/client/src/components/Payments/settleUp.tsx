import { Avatar, Box, Button, Card, Flex, For, SkeletonText, Stack, Text } from "@chakra-ui/react"
import { useTranslation } from "react-i18next";
import { useUserBalanceDetails } from "../../hooks/useUserBalanceDetails";
import { useNavigate } from "@tanstack/react-router";

const SettleUp = () => {

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
                                    <Box
                                        key={item.debt_debtId}
                                        p={2}
                                        shadow="md"
                                        borderRadius={"md"}
                                        cursor={"pointer"}
                                        _hover={{ backgroundColor: "gray.100" }}
                                        onClick={() => {
                                            navigate({ to: '/roommate/payments/settle-up/' + item.debt_debtId })
                                        }}
                                    >
                                        <Flex direction="row" gap="3" alignItems="center">
                                            <Avatar.Root size="lg" shape="full">
                                                {item.debtor ?
                                                    <Avatar.Image src={item.userTo_image} alt={item.userTo_firstName} /> :
                                                    <Avatar.Image src={item.userFrom_image} alt={item.userFrom_firstName} />
                                                }
                                                <Avatar.Fallback name={item.debtor ?
                                                    `${item.userTo_firstName} ${item.userTo_lastName}` :
                                                    `${item.userFrom_firstName} ${item.userFrom_lastName}`
                                                } />
                                            </Avatar.Root>
                                            <Flex direction="column" flexGrow={1}>
                                                <Text fontSize="lg" fontWeight="bold">
                                                    {item.debtor ?
                                                        `${item.userTo_firstName} ${item.userTo_lastName}` :
                                                        `${item.userFrom_firstName} ${item.userFrom_lastName}`
                                                    }
                                                </Text>
                                                <Text fontSize="sm" color="gray.500">
                                                    {item.debtor ?
                                                        item.userTo_phoneNumber :
                                                        item.userFrom_phoneNumber
                                                    }
                                                </Text>
                                            </Flex>
                                            <Text whiteSpace={"pre-line"} textAlign="end" color={item.debtor ? "red.600" : "green.600"}>
                                                {item.debtor ?
                                                    t('payments.you-owe', { amount: item.debt_amount }) :
                                                    t('payments.owe-you', { amount: item.debt_amount })
                                                }
                                            </Text>
                                        </Flex>
                                    </Box>
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

export default SettleUp