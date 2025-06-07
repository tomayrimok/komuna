import { Button, Drawer } from "@chakra-ui/react"
import { useTranslation } from "react-i18next";
import { IconShoppingCartPlus } from "@tabler/icons-react";

const CreatePurchaseButton = () => {

    const { t } = useTranslation();

    return (
        <Drawer.Trigger asChild>
            <Button
                zIndex={1000}
                position="fixed"
                bottom="110px"
                right={0}
                left={0}
                margin="auto"
                width="fit-content"
                fontSize={"lg"}
                fontWeight={"bold"}
                py={6}
                shadow={"md"}
            >
                <IconShoppingCartPlus size={20} />
                {t("shopping.make_purchase")}
            </Button>
        </Drawer.Trigger>
    )

}

export default CreatePurchaseButton