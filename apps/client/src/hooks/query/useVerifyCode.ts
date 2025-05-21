import { useMutation } from '@tanstack/react-query';
// import { API } from '../../axios';
// import { VerifyPhoneNumberDto } from '@komuna/types';

import { ApiTypes, API } from '@komuna/types';

import { type AxiosError } from 'axios';
import { toaster } from '../../chakra/ui/toaster';
import { t } from 'i18next';

const verifyCode = async (body: ApiTypes.VerifyPhoneNumberDto) => {
  try {
    const { data } = await API.userControllerVerify({ body });
    if (!data) throw new Error('No data returned from API');
    return data;
  } catch (error) {
    console.error('Error verifing code:', { error, body });
    throw (error as AxiosError)?.response?.data;
  }
};

interface UseSendVerificationCodeMutationReturn {
  sendVerifyCode: (data: ApiTypes.VerifyPhoneNumberDto) => void;
  isPending: boolean;
  isSuccess: boolean;
}

export const useVerifyCode = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (result: ApiTypes.UserCreatedResponseDto, variables: ApiTypes.VerifyPhoneNumberDto) => void;
  onError?: (message: string) => void;
}): UseSendVerificationCodeMutationReturn => {
  const {
    isSuccess,
    isPending,
    mutate: sendVerifyCode,
  } = useMutation<ApiTypes.UserCreatedResponseDto, { error: string }, ApiTypes.VerifyPhoneNumberDto>({
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
