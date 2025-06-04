import { Button } from "@chakra-ui/react"
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { IconPlus, IconMoneybagPlus } from "@tabler/icons-react";

const CreateIncidentButton = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate({ to: '/landlord/incident' });
    }

    return (
        <Button
            onClick={handleClick}
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
            <IconMoneybagPlus size={20} />
            פתיחת תקלה
            {/* {t('payments.incident.create-incident')} */}
        </Button>
    )

}

export default CreateIncidentButton