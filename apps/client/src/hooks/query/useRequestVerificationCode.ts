import { useMutation } from '@tanstack/react-query';
import { ApiTypes, API } from '@komuna/types';
import { AxiosError } from 'axios';
import { toaster } from '../../chakra/ui/toaster';
import { t } from 'i18next';

const sendVerificationCode = async (data: ApiTypes.LoginDto) => {
  try {
    await API.userControllerLoginOrCreate({ body: data });
  } catch (error) {
    console.error('Error sending code:', { error, data });
    throw (error as AxiosError)?.response?.data;
  }
};

interface UseRequestVerificationCodeMutationReturn {
  sendCode: (data: ApiTypes.LoginDto) => void;
  isPending: boolean;
  isSuccess: boolean;
}

export const useRequestVerificationCode = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (variables: ApiTypes.LoginDto) => void;
  onError?: (message: string) => void;
}): UseRequestVerificationCodeMutationReturn => {
  const {
    isSuccess,
    isPending,
    mutate: sendCode,
  } = useMutation<void, { error: string }, ApiTypes.LoginDto>({
    mutationFn: (data) => sendVerificationCode(data),
    onSuccess: (_, variables) => onSuccess?.(variables),
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

  return { sendCode, isPending, isSuccess };
};
