import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/auth/AuthProvider';
import { GeneralTaskResponseDto, CreateGeneralTaskDto, UpdateGeneralTaskDto } from '@komuna/types';

// Note: This will need to be replaced with the actual API client once generated
const API_BASE_URL = '/api';

const fetchGeneralTasks = async (apartmentId: string): Promise<GeneralTaskResponseDto[]> => {
    const response = await fetch(`${API_BASE_URL}/general-task?apartmentId=${apartmentId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch general tasks');
    }

    return response.json();
};

const createGeneralTask = async (dto: CreateGeneralTaskDto): Promise<GeneralTaskResponseDto> => {
    const response = await fetch(`${API_BASE_URL}/general-task/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        throw new Error('Failed to create general task');
    }

    return response.json();
};

const updateGeneralTask = async (dto: UpdateGeneralTaskDto): Promise<GeneralTaskResponseDto> => {
    const response = await fetch(`${API_BASE_URL}/general-task/update`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        throw new Error('Failed to update general task');
    }

    return response.json();
};

const deleteGeneralTask = async (generalTaskId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/general-task/${generalTaskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete general task');
    }
};

const manuallyGenerateTasks = async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/general-task/generate-tasks`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to generate tasks');
    }
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