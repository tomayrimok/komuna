import { useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { useDebtDetails } from "../../../hooks/useDebtDetails";
import { SettleUpDetails } from "./SettleUpDetails";
import { User } from "libs/types/src/generated/types.gen";

export const SettleUpDebt = () => {

    const { debtId } = useParams({ from: '/roommate/payments/settle-up/$debtId' });
    const { data: debtDetails, isLoading } = useDebtDetails(debtId);

    const fromUser = useMemo<User | null>(() => {

        if (isLoading || !debtDetails) return null;

        return debtDetails.fromUser

    }, [debtDetails, isLoading]);

    const toUser = useMemo<User | null>(() => {

        if (isLoading || !debtDetails) return null;

        return debtDetails.toUser

    }, [debtDetails, isLoading]);

    if (!debtDetails) return null;

    return (
        <SettleUpDetails
            fromUser={fromUser!}
            toUser={toUser!}
            debtAmount={debtDetails?.amount}
        />
    );
}