import { Box, Button, Card, For, FormatNumber, SkeletonText, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/auth/AuthProvider";
import { useUserBalanceDetails } from "../../hooks/useUserBalanceDetails";
import { roundUpToXDigits } from "../../utilities/roundUpToXDigits";

const BalanceCard = () => {

    const { t } = useTranslation();
    const { currentUserDetails } = useAuth();

    const { data, isLoading, isError } = useUserBalanceDetails(currentUserDetails!.userId);
    const navigate = useNavigate();

    return (
        <Box
            width="full"
            height={"23vh"}
            position={"relative"}
            overflow={"hidden"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <Box
                minW={"120vw"}
                height={"120vw"}
                borderRadius="50%"
                bg="brand.500"
                position={"absolute"}
                bottom={0}
                right={"-10vw"}
                zIndex={-1}

            />
            {!isLoading && data ?
                <>
                    <Text fontWeight={"bold"} fontSize="lg">
                        {data.balance < 0 ?
                            t('payments.debt') :
                            data.balance === 0 ?
                                t('payments.balanced') :
                                t('payments.people-owe-you')
                        }
                    </Text>
                    {data.balance !== 0 &&
                        <Text fontSize="4xl" fontWeight={"bold"}>
                            <FormatNumber value={roundUpToXDigits(Math.abs(data.balance))} />

                            <Text fontSize={"2xl"} as="span" me={1}>
                                ₪
                            </Text>
                        </Text>
                    }
                </>
                :
                <SkeletonText noOfLines={2} width="50%" m="auto" mb="2" />
            }
            {/* <Box as={"div"}>
                {!isLoading && data ?
                    <For each={data.balanceDetails}>
                        {(item) => (
                            <Stack key={item.debt_debtId} direction="row" gap="2" alignItems="center">
                                {item.debtor ?
                                    t('payments.you-owe-to', { amount: roundUpToXDigits(item.debt_amount), name: `${item.userTo_firstName} ${item.userTo_lastName[0]}` }) :
                                    t('payments.someone-owe-you', { amount: roundUpToXDigits(item.debt_amount), name: `${item.userFrom_firstName} ${item.userFrom_lastName[0]}` })
                                }
                            </Stack>
                        )}
                    </For>
                    :
                    <SkeletonText noOfLines={2} width="100%" />
                }
            </Box> */}
            <Box justifyContent="flex-end">
                <Button
                    mt={2}
                    bg={"brand.10"}
                    fontWeight={"bold"}
                    onClick={() => {
                        navigate({ to: '/roommate/payments/settle-up' })
                    }}
                >
                    {t('payments.settle-up')}
                </Button>
            </Box>
        </Box>

    )
}

export default BalanceCard