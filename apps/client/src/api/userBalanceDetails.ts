import { API } from '@komuna/types';

export const fetchUserBalanceDetails = async (apartmentId: string) => {
  const userBalanceDetailsRequest = API.debtEdgeControllerGetUserBalanceDetails({ query: { apartmentId } });
  const userBalanceRequest = API.debtEdgeControllerGetUserBalance({ query: { apartmentId } });

  const [userBalanceDetailsResponse, userBalanceResponse] = await Promise.all([
    userBalanceDetailsRequest,
    userBalanceRequest,
  ]);
  return { balanceDetails: userBalanceDetailsResponse.data || [], balance: userBalanceResponse.data || 0 };
};
