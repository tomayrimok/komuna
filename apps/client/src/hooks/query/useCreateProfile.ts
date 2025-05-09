import { useMutation } from '@tanstack/react-query';
import { API } from '../../axios';
import { CreateUserDto, UserResponse } from '@komuna/types';
import { type AxiosError } from 'axios';
import { toaster } from '../../chakra/ui/toaster';
import { t } from 'i18next';

interface CreateUserResponse {
  user: UserResponse;
}

const createProfile = async (body: CreateUserDto) => {
  try {
    const { data } = await API.post<CreateUserResponse>('/user', body);
    return data;
  } catch (error) {
    console.error('Error verifing code:', { error, body });
    throw (error as AxiosError)?.response?.data;
  }
};

interface UseCreateProfileMutationReturn {
  triggerCreateProfile: (data: CreateUserDto) => void;
  isPending: boolean;
  isSuccess: boolean;
}

export const useCreateProfile = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (result: CreateUserResponse, variables: CreateUserDto) => void;
  onError?: (message: string) => void;
}): UseCreateProfileMutationReturn => {
  const {
    isSuccess,
    isPending,
    mutate: triggerCreateProfile,
  } = useMutation<CreateUserResponse, { error: string }, CreateUserDto>({
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
