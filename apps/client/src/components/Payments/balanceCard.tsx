import { Button, Card, For, SkeletonText, Stack } from "@chakra-ui/react"
import { useTranslation } from "react-i18next";
import { useUserBalanceDetails } from "../../hooks/useUserBalanceDetails";
import { useNavigate } from "@tanstack/react-router";

const BalanceCard = () => {

    const { t } = useTranslation();
    const { data, isLoading, isError } = useUserBalanceDetails('60514c72-5b94-417f-b4a3-9da2092a267f', '9ebd215a-8101-4a5a-96c3-04016aabcd1b');
    const navigate = useNavigate();

    return (
        <Card.Root width="100%">
            <Card.Body gap="2">
                {!isLoading && data ?
                    <Card.Title mb="2">
                        {data.balance < 0 ?
                            t('payments.debt', { amount: Math.abs(data.balance) }) :
                            data.balance === 0 ?
                                t('payments.balanced') :
                                t('payments.people-owe-you', { amount: data.balance })
                        }
                    </Card.Title>
                    :
                    <SkeletonText noOfLines={1} width="50%" mb="2" />
                }
                <Card.Description as={"div"}>
                    {!isLoading && data ?
                        <For each={data.balanceDetails}>
                            {(item) => (
                                <Stack key={item.debt_debtId} direction="row" gap="2" alignItems="center">
                                    {item.debtor ?
                                        t('payments.you-owe-to', { amount: item.debt_amount, name: `${item.userTo_firstName} ${item.userTo_lastName[0]}` }) :
                                        t('payments.someone-owe-you', { amount: item.debt_amount, name: `${item.userFrom_firstName} ${item.userFrom_lastName[0]}` })
                                    }
                                </Stack>
                            )}
                        </For>
                        :
                        <SkeletonText noOfLines={2} width="100%" />
                    }
                </Card.Description>
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
                <Button
                    onClick={() => {
                        navigate({
                            to: '/roommate/payments/settle-up',
                            params: {
                                userId: '60514c72-5b94-417f-b4a3-9da2092a267f',
                                debtId: '9ebd215a-8101-4a5a-96c3-04016aabcd1b'
                            }
                        })
                    }}
                >
                    {t('payments.settle-up')}
                </Button>
            </Card.Footer>
        </Card.Root>
    )
}

export default BalanceCard