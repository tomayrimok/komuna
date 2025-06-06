import { useQuery } from '@tanstack/react-query';
import { API, ContextType } from '@komuna/types';
import { useAuth } from '../../context/auth/AuthProvider';

const getShoppingList = async (contextType: ContextType, apartmentId: string) => {
  const { data } = await API.shoppingListControllerGetShoppingList({
    query: { contextType, apartmentId },
  });
  return data;
};

export const useShoppingListQuery = (contextType: ContextType) => {
  const {
    sessionDetails: { apartmentId },
  } = useAuth();

  return useQuery({
    queryKey: ['shoppingList', contextType, apartmentId],
    queryFn: () => getShoppingList(contextType, apartmentId!),
    staleTime: 0,
    enabled: !!apartmentId,
  });
};
