import { useMutation } from '@tanstack/react-query';
import { ApiTypes, API } from '@komuna/types';
import { type AxiosError } from 'axios';
import { toaster } from '../../chakra/ui/toaster';
import { t } from 'i18next';

const createProfile = async (body: ApiTypes.CreateUserDto) => {
  try {
    const { data } = await API.userControllerCreateUser({ body });
    if (!data) throw new Error('No data returned from API');
    return data;
  } catch (error) {
    console.error('Error verifing code:', { error, body });
    throw (error as AxiosError)?.response?.data;
  }
};

interface UseCreateProfileMutationReturn {
  triggerCreateProfile: (data: ApiTypes.CreateUserDto) => void;
  isPending: boolean;
  isSuccess: boolean;
}

export const useCreateProfile = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (result: ApiTypes.UserResponseDto, variables: ApiTypes.CreateUserDto) => void;
  onError?: (message: string) => void;
}): UseCreateProfileMutationReturn => {
  const {
    isSuccess,
    isPending,
    mutate: triggerCreateProfile,
  } = useMutation<ApiTypes.UserResponseDto, { error: string }, ApiTypes.CreateUserDto>({
    mutationFn: (body) => createProfile(body),
    onSuccess: (result, variables) => onSuccess?.(result, variables),
    onError: (error) => {
      if (onError) {
        onError?.(error?.error);
      } else {
        toaster.create({
          title: error?.error || t('error.action_failed'),
          type: 'error',
        });
      }
    },
  });

  return { triggerCreateProfile, isPending, isSuccess };
};
