import { Button } from "@chakra-ui/react";
import { IconFlagPlus } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const CreateIncidentButton = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate({ to: '/landlord/incident/details' });
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
            <IconFlagPlus size={20} />
            {t('incidents.create_incident')}
        </Button>
    )

}

export default CreateIncidentButton