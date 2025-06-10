import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { UserCompletionStatus } from './dto/user-completion-status.dto';
import { UserService } from '../user/user.service';
import { Brackets } from 'typeorm';
import { AddEditTaskDto, CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly userService: UserService
  ) { }

  async addEditTask(taskDto: AddEditTaskDto, userId: string): Promise<Task> {
    if (taskDto.taskId) {
      const existingTask = await this.taskRepo.findOneBy({
        taskId: taskDto.taskId,
        apartmentId: taskDto.apartmentId,
      });

      if (existingTask) return this.taskRepo.save({ ...existingTask, ...taskDto });
    }

    const newTask = this.taskRepo.create({
      ...taskDto,
      createdByUserId: userId,
    });

    return await this.taskRepo.save(newTask);

  }

  async updateTaskStatus(taskId: string, userId: string, status: boolean) {
    const task = await this.taskRepo.findOneBy({ taskId });
    task.completions.find((c) => c.userId === userId).status = status;
    return this.taskRepo.save(task);
  }

  async editTask(taskId: string, editTaskDto: UpdateTaskDto) {
    const task = await this.taskRepo.findOneBy({ taskId });
    if (!task) {
      throw new BadRequestException('Task was not found');
    }
    if (!editTaskDto.assignedTo) {
      throw new BadRequestException('Must have at least one assigned user');
    }
    const users = editTaskDto.assignedTo
      ? await this.userService.getUsersByUserId(editTaskDto.assignedTo)
      : task.assignedTo;

    const updateTask = {
      ...task,
      ...editTaskDto,
      assignedTo: Array.isArray(users) ? users : [users],
    };
    return this.taskRepo.update(taskId, updateTask);
  }

  async getTask(userId: string, apartmentId: string, getCompletedTasks?: boolean, skip?: number, take?: number) {
    if (getCompletedTasks) {
      return this.taskRepo.find({
        where: {
          createdByUserId: userId,
          apartmentId,
          completions: { userId, status: true },
        },
        skip,
        take,
        order: { createdAt: 'DESC' },
      });
    }
    return this.taskRepo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'user')
      .select([
        'task.taskId',
        'task.apartmentId',
        'task.title',
        'task.description',
        'task.dueDate',
        'task.dueTime',
        'task.isRecurrent',
        'task.createdByUserId',
        'task.createdAt',
        'user.userId',
        'user.firstName',
        'user.lastName',
        'user.phoneNumber',
        'user.image',
        'user.createdAt'
      ])
      .where('task.apartmentId = :apartmentId')
      // .andWhere(
      //   new Brackets(qb => {
      //     qb.where('task.createdByUserId = :userId').orWhere('user.userId = :userId');
      //   })
      // )
      // .andWhere(new Brackets(qb => {
      //   qb.where('task.dueDate >= :currentDate')
      //     .orWhere('task.isRecurrent = TRUE');
      // }))
      .setParameters({
        userId,
        apartmentId,
        currentDate: new Date().toISOString(),
      })
      .orderBy('task.dueDate', 'DESC')
      .distinct(true)
      .skip(skip)
      .take(take)
      .getMany();
  }

  async getTaskById(taskId: string) {
    return await this.taskRepo.findOne({
      where: { taskId },
    });
  }

  async setTaskCompletion(taskId: string, userId: string, isCompleted: boolean) {
    const task = await this.taskRepo.findOne({
      where: { taskId },
      relations: ['completions'],
    });

    if (task) {
      const completion = task.completions.find((c) => c.userId === userId);
      if (completion) {
        completion.status = isCompleted;
      } else {
        task.completions.push({ userId, status: isCompleted } as UserCompletionStatus);
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

  async IsUserAParticipant(taskId: string, userId: string): Promise<boolean> {
    const task = await this.taskRepo.findOne({
      where: { taskId },
      relations: ['assignedTo'],
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return task.assignedTo.some((user) => user.userId === userId);
  }
}
