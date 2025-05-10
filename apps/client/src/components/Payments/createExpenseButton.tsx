import { Button } from "@chakra-ui/react"
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LuPlus } from "react-icons/lu";

const CreateExpenseButton = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate({ to: '/roommate/payments/expenses' });
    }

    return (
        <Button onClick={handleClick}>
            <LuPlus size={20} />
            {t('payments.create-expense')}
        </Button>
    )

}

export default CreateExpenseButton