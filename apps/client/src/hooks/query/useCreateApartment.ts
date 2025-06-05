import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { API, ApiTypes, CreateApartmentHttpResponse } from '@komuna/types';
import { toaster } from '../../chakra/ui/toaster';
import { t } from 'i18next';

const createApartment = async (body: ApiTypes.CreateApartmentDto): Promise<CreateApartmentHttpResponse> => {
  try {
    const { data } = await API.apartmentControllerCreateApartment({ body });
    if (!data) throw new Error('No data returned from API');
    return data as CreateApartmentHttpResponse;
  } catch (error) {
    console.error('Error creating an apartment:', { error, body });
    throw (error as AxiosError)?.response?.data;
  }
};

interface UseCreateApartmentMutationReturn {
  triggerCreateApartment: (data: ApiTypes.CreateApartmentDto) => void;
  isPending: boolean;
  isSuccess: boolean;
}

export const useCreateApartment = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (result: CreateApartmentHttpResponse, variables: ApiTypes.CreateApartmentDto) => void;
  onError?: (message: string) => void;
}): UseCreateApartmentMutationReturn => {
  const {
    isSuccess,
    isPending,
    mutate: triggerCreateApartment,
  } = useMutation<CreateApartmentHttpResponse, { error: string }, ApiTypes.CreateApartmentDto>({
    mutationKey: ['createApartment'],
    mutationFn: (body) => createApartment(body),
    onSuccess: (result, variables) => {
      onSuccess?.(result, variables);
    },
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

  return { triggerCreateApartment, isPending, isSuccess };
};
