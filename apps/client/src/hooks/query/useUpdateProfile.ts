import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiTypes, API } from '@komuna/types';
import { type AxiosError } from 'axios';
import { toaster } from '../../chakra/ui/toaster';
import { t } from 'i18next';
import { AUTH_QUERY_KEY } from './useAuthQuery';

const updateProfile = async (body: ApiTypes.UpdateUserDto) => {
  try {
    const { data } = await API.userControllerUpdateUserProfile({ body });
    if (!data) throw new Error('No data returned from API');
    return data;
  } catch (error) {
    console.error('Error updating profile:', { error, body });
    throw (error as AxiosError)?.response?.data;
  }
};

interface UseUpdateProfileMutationReturn {
  triggerUpdateProfile: (data: ApiTypes.UpdateUserDto) => void;
  isPending: boolean;
  isSuccess: boolean;
}

interface UseUpdateProfileProps {
  onSuccess?: (data: ApiTypes.UserResponseDto) => void;
  onError?: (error: Error) => void;
}

export const useUpdateProfile = ({
  onSuccess,
  onError,
}: UseUpdateProfileProps = {}): UseUpdateProfileMutationReturn => {
  const queryClient = useQueryClient();

  const {
    mutate: triggerUpdateProfile,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY] });

      toaster.create({
        meta: { closable: true },
        type: 'success',
        title: t('profile.update_success'),
        description: t('profile.update_success_description'),
        duration: 3000,
      });

      onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
      toaster.create({
        meta: { closable: true },
        type: 'error',
        title: t('profile.update_error'),
        description: t('profile.update_error_description'),
        duration: 5000,
      });

      onError?.(error);
    },
  });

  return { triggerUpdateProfile, isPending, isSuccess };
};
