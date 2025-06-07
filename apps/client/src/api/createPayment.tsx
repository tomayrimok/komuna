import { API, ApiTypes } from '@komuna/types';

export const postCreatePayment = async (data: ApiTypes.CreatePaymentDto) => {
  const response = await API.paymentControllerCreatePayment({ body: data, throwOnError: true });
  return response.data;
};
