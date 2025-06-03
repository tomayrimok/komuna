import { TaskDto } from '@komuna/types'
import { ApiClient as API, ApiTypes } from '@komuna/types';
import { useMutation } from '@tanstack/react-query';

interface GetTask {
    userId: string;
    apartmentId: string;
}

export const GetTasks = async (body: GetTask) => {
    try {
        const { data } = await API.get<GetTask[]>()
        return data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
}

export const CreateTask = async () => {
    return
}