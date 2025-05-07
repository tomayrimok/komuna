import { useMutation } from '@tanstack/react-query';
import { API } from '../../axios';
import { VerifyPhoneNumberDto } from '@komuna/types';
import { type AxiosError } from 'axios';
import { toaster } from '../../chakra/ui/toaster/toaster-store';
import { t } from 'i18next';

interface VerifyCodeResponse {
  isUser: boolean;
}

const verifyCode = async (body: VerifyPhoneNumberDto) => {
  try {
    const { data } = await API.post<VerifyCodeResponse>('/user/verify', body);
    return data;
  } catch (error) {
    console.error('Error verifing code:', { error, body });
    throw (error as AxiosError)?.response?.data;
  }
};

interface UseSendVerificationCodeMutationReturn {
  sendVerifyCode: (data: VerifyPhoneNumberDto) => void;
  isPending: boolean;
  isSuccess: boolean;
}

export const useVerifyCode = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (result: VerifyCodeResponse, variables: VerifyPhoneNumberDto) => void;
  onError?: (message: string) => void;
}): UseSendVerificationCodeMutationReturn => {
  const {
    isSuccess,
    isPending,
    mutate: sendVerifyCode,
  } = useMutation<VerifyCodeResponse, { error: string }, VerifyPhoneNumberDto>({
    mutationFn: (body) => verifyCode(body),
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

  return { sendVerifyCode, isPending, isSuccess };
};
