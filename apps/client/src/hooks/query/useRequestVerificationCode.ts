import { useMutation } from '@tanstack/react-query';
import { API } from '../../axios';
import { LoginDto } from '@komuna/types';
import { AxiosError } from 'axios';
import { toaster } from '../../chakra/ui/toaster/toaster-store';
import { t } from 'i18next';

const sendVerificationCode = async (data: LoginDto) => {
  try {
    await API.post('/user/login', data);
  } catch (error) {
    console.error('Error sending code:', { error, data });
    throw (error as AxiosError)?.response?.data;
  }
};

interface UseRequestVerificationCodeMutationReturn {
  sendCode: (data: LoginDto) => void;
  isPending: boolean;
  isSuccess: boolean;
}

export const useRequestVerificationCode = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (variables: LoginDto) => void;
  onError?: (message: string) => void;
}): UseRequestVerificationCodeMutationReturn => {
  const {
    isSuccess,
    isPending,
    mutate: sendCode,
  } = useMutation<void, { error: string }, LoginDto>({
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
