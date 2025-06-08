import { API, ApiTypes } from '@komuna/types';

export const fetchApartment = async (apartmentId: string) => {
  const response = await API.apartmentControllerGetApartmentWithResidents({
    query: {
      apartmentId,
    },
  });

  return response.data;
};
