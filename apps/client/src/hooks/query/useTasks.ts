import { TaskDto } from '@komuna/types'
import { API } from '../../axios';
import { useMutation } from '@tanstack/react-query';

interface GetTask {
    userId: string;
    apartmentId: string;
}

export const GetTasks = async (body: TaskDto) => {
    try {
        const { data } = await API.get<TaskDto[]>()
    }
}

export const CreateTask = async () => {

}