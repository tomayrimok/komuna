import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/auth/AuthProvider';
import { useNavigate } from '@tanstack/react-router';
import { toaster } from '../../chakra/ui/toaster';
import { API, ApiTypes } from '@komuna/types';

export const postCreateIncident = async (data: ApiTypes.AddEditIncidentDto) => {
  const response = await API.incidentControllerAddEditIncident({ body: data, throwOnError: true });
  return response.data;
};

export const useAddEditIncident = () => {
  const queryClient = useQueryClient();
  const { currentUserDetails } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: postCreateIncident,
    onSuccess: (data, variables) => {
      // navigate({ to:  '/roommate/payments' });
      toaster.success({ title: t('incidents.incident_saved') });
      queryClient.invalidateQueries({ queryKey: ['incidents', variables.apartmentId] });
      // queryClient.invalidateQueries({ queryKey: ['incidents', apartmentData?.apartmentId] });
    },
    onError: (error: any) => {
      toaster.error({ title: t('error.action_failed') });
    },
  });
};
