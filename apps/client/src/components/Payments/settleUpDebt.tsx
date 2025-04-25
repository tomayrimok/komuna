import { useParams } from "@tanstack/react-router";
import { useDebtDetails } from "../../hooks/useDebtDetails";

export const SettleUpDebt = () => {

    const { debtId } = useParams({ from: '/roommate/payments/settle-up/$debtId' });
    const { data, isLoading, isError } = useDebtDetails(debtId);

    return (
        <div>
            {data && (
                <div>
                    <h1>Debt Details</h1>
                    <p>From: {data.userFrom_firstName} {data.userFrom_lastName}</p>
                    <p>To: {data.userTo_firstName} {data.userTo_lastName}</p>
                    <p>Amount: {data.debt_amount}</p>
                </div>
            )}
        </div>
    );
}