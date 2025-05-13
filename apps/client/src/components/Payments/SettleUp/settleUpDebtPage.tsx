import { UserResponse } from "@komuna/types";
import { useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { useDebtDetails } from "../../../hooks/useDebtDetails";
import { SettleUpDetails } from "./SettleUpDetails";

export const SettleUpDebt = () => {

    const { debtId } = useParams({ from: '/roommate/payments/settle-up/$debtId' });
    const { data: debtDetails, isLoading } = useDebtDetails(debtId);

    const fromUser = useMemo<UserResponse | null>(() => {

        if (isLoading || !debtDetails) return null;

        return {
            firstName: debtDetails.userFrom_firstName,
            lastName: debtDetails.userFrom_lastName,
            image: debtDetails.userFrom_image,
            phoneNumber: debtDetails.userFrom_phoneNumber,
            userId: debtDetails.debt_fromId,
        };

    }, [debtDetails, isLoading]);

    const toUser = useMemo<UserResponse | null>(() => {

        if (isLoading || !debtDetails) return null;

        return {
            firstName: debtDetails.userTo_firstName,
            lastName: debtDetails.userTo_lastName,
            image: debtDetails.userTo_image,
            phoneNumber: debtDetails.userTo_phoneNumber,
            userId: debtDetails.debt_toId,
        };

    }, [debtDetails, isLoading]);

    if (!debtDetails) return null;

    return (
        <SettleUpDetails
            fromUser={fromUser!}
            toUser={toUser!}
            debtAmount={debtDetails?.debt_amount}
        />
    );
}