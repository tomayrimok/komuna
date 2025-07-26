import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/auth/AuthProvider';
import { GeneralTaskResponseDto, CreateGeneralTaskDto, UpdateGeneralTaskDto } from '@komuna/types';
import axios from 'axios';

const fetchGeneralTasks = async (apartmentId: string): Promise<GeneralTaskResponseDto[]> => {
    const response = await axios.get(`/api/general-task?apartmentId=${apartmentId}`);

    return response.data;
};

const createGeneralTask = async (dto: CreateGeneralTaskDto): Promise<GeneralTaskResponseDto> => {
    const response = await axios.post(`/api/general-task/create`, dto);

    return response.data;
};

const updateGeneralTask = async (dto: UpdateGeneralTaskDto): Promise<GeneralTaskResponseDto> => {
    const response = await axios.put(`/api/general-task/update`, dto);

    return response.data;
};

const deleteGeneralTask = async (generalTaskId: string): Promise<void> => {
    await axios.delete(`/api/general-task/${generalTaskId}`);
};

const manuallyGenerateTasks = async (): Promise<void> => {
    await axios.post(`/api/general-task/generate-tasks`);
};

export const useGeneralTasks = () => {
    const { sessionDetails: { apartmentId } } = useAuth();

    return useQuery({
        queryKey: ['general-tasks', apartmentId],
        queryFn: () => fetchGeneralTasks(apartmentId!),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        enabled: !!apartmentId,
    });
};

export const useCreateGeneralTask = () => {
    const queryClient = useQueryClient();
    const { sessionDetails: { apartmentId } } = useAuth();

    return useMutation({
        mutationFn: createGeneralTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['general-tasks', apartmentId] });
        },
    });
};

export const useUpdateGeneralTask = () => {
    const queryClient = useQueryClient();
    const { sessionDetails: { apartmentId } } = useAuth();

    return useMutation({
        mutationFn: updateGeneralTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['general-tasks', apartmentId] });
        },
    });
};

export const useDeleteGeneralTask = () => {
    const queryClient = useQueryClient();
    const { sessionDetails: { apartmentId } } = useAuth();

    return useMutation({
        mutationFn: deleteGeneralTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['general-tasks', apartmentId] });
        },
    });
};

export const useManuallyGenerateTasks = () => {
    const queryClient = useQueryClient();
    const { sessionDetails: { apartmentId } } = useAuth();

    return useMutation({
        mutationFn: manuallyGenerateTasks,
        onSuccess: () => {
            // Refresh both general tasks and regular tasks
            queryClient.invalidateQueries({ queryKey: ['general-tasks', apartmentId] });
            queryClient.invalidateQueries({ queryKey: ['tasks', apartmentId] });
        },
    });
}; 