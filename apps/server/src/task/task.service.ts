import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {

    constructor(
        @InjectRepository(Task)
        private readonly taskRepo: Repository<Task>,
    ) { }

    async createTask(task: Partial<Task>) {
        return await this.taskRepo.save(task);
    }

    async updateTask(taskId: string, task: Partial<Task>) {
        return await this.taskRepo.update({ taskId }, task);
    }

    async getTask(taskId: string) {
        return await this.taskRepo.findOneBy({ taskId });
    }

    async getTasksByApartmentId(apartmentId: string) {
        return await this.taskRepo.find({
            where: { apartmentId },
            order: { createdAt: 'DESC' },
        });
    }
}
