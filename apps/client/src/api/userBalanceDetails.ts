import { API } from "@komuna/types";

export const fetchUserBalanceDetails = async (apartmentId: string, userId: string) => {

    const userBalanceDetailsRequest = API.debtEdgeControllerGetUserBalanceDetails({ query: { apartmentId, userId } });
    const userBalanceRequest = API.debtEdgeControllerGetUserBalance({ query: { apartmentId, userId } });

    const [userBalanceDetailsResponse, userBalanceResponse] = await Promise.all([userBalanceDetailsRequest, userBalanceRequest]);
    return { balanceDetails: userBalanceDetailsResponse.data || [], balance: userBalanceResponse.data || 0 };
};
