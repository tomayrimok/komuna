import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    CreateGeneralShoppingListDto,
    UpdateGeneralShoppingListDto,
    GenerateShoppingListFromTemplateDto,
    GeneralShoppingListResponseDto,
    ContextType
} from '@komuna/types';
import { useAuth } from '../../context/auth/AuthProvider';
import axios from 'axios';
import { toaster } from '../../chakra/ui/toaster';
import { useTranslation } from 'react-i18next';

const fetchGeneralShoppingLists = async (apartmentId: string): Promise<GeneralShoppingListResponseDto[]> => {
    const response = await axios.get(`/api/general-shopping-list/list?apartmentId=${apartmentId}`);
    return response.data;
};

const fetchGeneralShoppingListById = async (generalShoppingListId: string): Promise<GeneralShoppingListResponseDto> => {
    const response = await axios.get(`/api/general-shopping-list/details?generalShoppingListId=${generalShoppingListId}`);
    return response.data;
};

export const useGeneralShoppingLists = () => {
    const { sessionDetails } = useAuth();

    return useQuery({
        queryKey: ['general-shopping-lists', sessionDetails?.apartmentId],
        queryFn: () => fetchGeneralShoppingLists(sessionDetails?.apartmentId!),
        enabled: !!sessionDetails?.apartmentId,
        refetchOnWindowFocus: false,
    });
};

export const useGeneralShoppingListById = (generalShoppingListId?: string) => {
    return useQuery({
        queryKey: ['general-shopping-list', generalShoppingListId],
        queryFn: () => fetchGeneralShoppingListById(generalShoppingListId!),
        enabled: !!generalShoppingListId,
        refetchOnWindowFocus: false,
    });
};

const createGeneralShoppingList = async (dto: CreateGeneralShoppingListDto): Promise<GeneralShoppingListResponseDto> => {
    const response = await axios.post(`/api/general-shopping-list/create`, dto);

    return response.data;
};

const updateGeneralShoppingList = async (dto: UpdateGeneralShoppingListDto): Promise<GeneralShoppingListResponseDto> => {
    const response = await axios.post(`/api/general-shopping-list/update`, dto);

    return response.data;
};

const deleteGeneralShoppingList = async (generalShoppingListId: string): Promise<void> => {
    await axios.delete(`/api/general-shopping-list/delete?generalShoppingListId=${generalShoppingListId}`);
};

const generateFromTemplate = async (dto: GenerateShoppingListFromTemplateDto): Promise<ContextType> => {
    return await axios.post(`/api/general-shopping-list/generate`, dto);
};

const duplicateGeneralShoppingList = async (generalShoppingListId: string): Promise<GeneralShoppingListResponseDto> => {
    const response = await axios.post(`/api/general-shopping-list/duplicate?generalShoppingListId=${generalShoppingListId}`);
    return response.data;
};

export const useCreateGeneralShoppingList = () => {
    const queryClient = useQueryClient();
    const { sessionDetails } = useAuth();

    return useMutation({
        mutationFn: createGeneralShoppingList,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['general-shopping-lists', sessionDetails?.apartmentId]
            });
        },
    });
};

export const useUpdateGeneralShoppingList = () => {
    const queryClient = useQueryClient();
    const { sessionDetails } = useAuth();

    return useMutation({
        mutationFn: updateGeneralShoppingList,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['general-shopping-lists', sessionDetails?.apartmentId]
            });
            queryClient.invalidateQueries({
                queryKey: ['general-shopping-list', data.generalShoppingListId]
            });
        },
    });
};

export const useDeleteGeneralShoppingList = () => {
    const queryClient = useQueryClient();
    const { sessionDetails } = useAuth();

    return useMutation({
        mutationFn: deleteGeneralShoppingList,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['general-shopping-lists', sessionDetails?.apartmentId]
            });
        },
    });
};

export const useManuallyGenerateFromTemplate = () => {
    const queryClient = useQueryClient();
    const { sessionDetails } = useAuth();
    const { t } = useTranslation();
    return useMutation({
        mutationFn: generateFromTemplate,
        onSuccess: (data) => {
            toaster.create({
                title: t('shopping.general_lists.copy_to_list_success'),
                type: 'success',
            });
            // Invalidate shopping lists to show the newly generated lists
            queryClient.invalidateQueries({
                queryKey: ['shoppingList', data, sessionDetails?.apartmentId]
            });
        },
    });
};

export const useDuplicateGeneralShoppingList = () => {
    const queryClient = useQueryClient();
    const { sessionDetails } = useAuth();

    return useMutation({
        mutationFn: duplicateGeneralShoppingList,
        onSuccess: () => {
            // Invalidate general shopping lists to show the duplicated list
            queryClient.invalidateQueries({
                queryKey: ['general-shopping-lists', sessionDetails?.apartmentId]
            });
        },
    });
}; 