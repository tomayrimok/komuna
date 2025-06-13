import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { AddEditTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Task } from './task.entity';

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

  // async updateTaskStatus(taskId: string, userId: string, status: boolean) {
  //   const task = await this.taskRepo.findOneBy({ taskId });
  //   task.completions.find((c) => c.userId === userId).status = status;
  //   return this.taskRepo.save(task);
  // }

  async editTask(taskId: string, editTaskDto: UpdateTaskDto) {
    const task = await this.taskRepo.findOneBy({ taskId });
    if (!task) {
      throw new BadRequestException('Task was not found');
    }
    if (!editTaskDto.assignedTo) {
      throw new BadRequestException('Must have at least one assigned user');
    }
    const users = editTaskDto.assignedTo
      ? await this.userService.getUsersByUserId(editTaskDto.assignedTo.map((user) => user.userId))
      : task.assignedTo;

    const updateTask = {
      ...task,
      ...editTaskDto,
      assignedTo: Array.isArray(users) ? users : [users],
    };
    return this.taskRepo.update(taskId, updateTask);
  }

  async getTasks(userId: string, apartmentId: string, getCompletedTasks?: boolean, skip?: number, take?: number) {
    if (getCompletedTasks) {
      return this.taskRepo.find({
        where: {
          apartmentId,
        },
        skip,
        take,
        order: { createdAt: 'DESC' },
      });
    }
    return this.taskRepo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'user')
      .where('task.apartmentId = :apartmentId')
      .select([
        'task.taskId',
        'task.title',
        'task.description',
        'task.dueDate',
        'task.createdAt',
        'task.createdByUserId',
        'task.completions',
        'user.userId',
        'user.firstName',
        'user.lastName',
        'user.image',
      ])
      .setParameters({
        userId,
        apartmentId,
        currentDate: new Date().toISOString(),
      })
      // .orderBy('task.dueDate', 'DESC')
      // .addOrderBy('task.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async getTaskById(taskId: string) {
    return await this.taskRepo.findOne({
      where: { taskId },
      relations: {
        createdBy: true,
      },
    });
  }

  async setTaskCompletion(taskId: string, userId: string, isCompleted: boolean) {
    const task = await this.taskRepo.findOne({
      where: { taskId }
    });

    if (!task) throw new BadRequestException('Task not found');

    if (isCompleted) task.completions.push(userId);
    else task.completions = task.completions.filter((c) => c !== userId);

    return await this.taskRepo.save(task);

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
