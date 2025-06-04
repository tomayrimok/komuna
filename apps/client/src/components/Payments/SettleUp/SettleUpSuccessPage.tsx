import { Button, Image, Text, VStack } from "@chakra-ui/react"
import { useTranslation } from "react-i18next"

const SettleUpSuccessPage = () => {
    const { t } = useTranslation()
    return (
        <VStack gap={4} align="center" justify="center" height="100vh">
            <Image src="/meerkats/dealers.png" width="60vw" />
            <Text fontSize="3xl">{t("payments.settle-up-success")}</Text>
        </VStack>
    )
}
export default SettleUpSuccessPage