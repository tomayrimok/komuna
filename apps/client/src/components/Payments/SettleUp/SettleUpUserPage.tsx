import { UserResponse } from "@komuna/types";
import { useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/auth/AuthProvider";
import { useApartment } from "../../../hooks/useApartment";
import { SettleUpDetails } from "./SettleUpDetails";

export const SettleUpUser = () => {

    const { toUserId } = useParams({ from: '/roommate/payments/settle-up/user/$toUserId' });
    const { data: apartmentData } = useApartment();
    const { currentUserDetails } = useAuth();
    const { t } = useTranslation();

    const fromUser = useMemo<UserResponse | null>(() => currentUserDetails!, [toUserId]);
    const toUser = useMemo<UserResponse | null>(() => apartmentData?.residents.find((user) => user.userId === toUserId)?.user ?? null, [apartmentData, toUserId]);

    return (
        <SettleUpDetails
            fromUser={fromUser!}
            toUser={toUser!}
            debtAmount={0}
        />
    );
}