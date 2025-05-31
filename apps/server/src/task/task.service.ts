import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository, In } from 'typeorm';
import { TaskDto } from '@komuna/types';
import { User } from '../user/user.entity';
import { UserCompletionStatus } from '@komuna/types';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {}

  async createTask(taskDto: TaskDto) {
    // If there are multiple userIds, save them as an array, else save the single
    // element as an 1-D array
    const ids = Array.isArray(taskDto.assignedTo) ? taskDto.assignedTo : [taskDto.assignedTo];
    const users = await this.userRepo.findBy({ userId: In(ids) });

    const task = this.taskRepo.create({
      ...taskDto,
      assignedTo: users,
    });

    return this.taskRepo.save(task);
  }

  async updateTask(taskId: string, task: Partial<Task>) {
    return await this.taskRepo.update({ taskId }, task);
  }

  async getTask(userId: string, apartmentId: string, getCompleted?: boolean, skip?: number, take?: number) {
    const currentDate = new Date();
    if (getCompleted) {
      return this.taskRepo.find({
        where: {
          createdBy: userId,
          apartmentId,
          completions: { userId, isCompleted: true},
        },
        skip,
        take,
        order: { createdAt: 'DESC' },
      });
    }
    return this.taskRepo
      .createQueryBuilder('task')
      .leftJoin('task.assignedTo', 'user')
      .select('task')
      .addSelect(['user.firstName', 'user.lastName'])
      .where(
        '(task.createdBy = :userId AND task.apartmentId = :apartmentId) OR ' +
          '(task.apartmentId = :apartmentId AND user.userId = :userId)',
        { userId, apartmentId }
      )
      .andWhere('task.dueDate >= :currentDate OR task.isRecurrent = true', { currentDate: currentDate.toISOString() })
      .orderBy('task.dueDate', 'DESC')
      .getMany();
  }

  async setTaskCompletion(taskId: string, userId: string, isCompleted: boolean) {
    const task = await this.taskRepo.findOne({
      where: { taskId },
      relations: ['completions'],
    });

    if (task) {
      const completion = task.completions.find(c => c.userId === userId);
      if (completion) {
        completion.isCompleted = isCompleted;
      } else {
        task.completions.push({ userId, isCompleted } as UserCompletionStatus);
      }
      return await this.taskRepo.save(task);
    }

    throw new Error('Task not found');
  }

  async getTasksByApartmentId(apartmentId: string) {
    return await this.taskRepo.find({
      where: { apartmentId },
      order: { dueDate: 'DESC' },
    });
  }
}
