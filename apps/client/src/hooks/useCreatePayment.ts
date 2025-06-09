import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { postCreatePayment } from '../api/createPayment';
import { toaster } from '../chakra/ui/toaster';
import { useAuth } from '../context/auth/AuthProvider';

export const useCreatePayment = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCreatePayment,
    onSuccess: (data, variables) => {
      navigate({ to: '/roommate/payments' });
      toaster.success({ title: t('payments.settle-up-success') });
      queryClient.invalidateQueries({
        queryKey: ['userBalanceDetails', variables.apartmentId],
      });
    },
    onError: (error: any) => {
      toaster.error({ title: error?.response.data.error || t('error.action_failed') });
    },
  });
};
