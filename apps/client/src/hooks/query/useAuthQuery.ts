import { useQuery } from '@tanstack/react-query';
import { API } from '@komuna/types';
import { AxiosError } from 'axios';

const getCurrentUser = async () => {
  try {
    const { data } = await API.userControllerGetCurrentUserProfile();
    return data?.user;
  } catch (error) {
    // check if error status code is 401
    if ((error as AxiosError).response?.status === 401) {
      return null;
    }
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const AUTH_QUERY_KEY = 'auth';
export const useAuthQuery = () => {
  const {
    data: currentUserDetails,
    isRefetching,
    isPending: isAuthLoading,
    isSuccess,
    refetch: refetchAuth,
  } = useQuery({
    queryKey: [AUTH_QUERY_KEY],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 0,
  });

  return { currentUserDetails, isAuthLoading, isRefetching, refetchAuth, isSuccess };
};
