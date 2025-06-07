import { API } from '@komuna/types';
import axios from 'axios';

export const fetchDebtDetails = async (debtId: string) => {
  const response = await API.debtEdgeControllerGetDebtDetails({
    query: {
      debtId,
    },
  });
  return response.data;
};
