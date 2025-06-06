import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/task.dto';
import { UserCompletionStatus } from './dto/user-completion-status.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly userService: UserService,
  ) {}

  async createTask(taskDto: CreateTaskDto) {
    // If there are multiple userIds, save them as an array, else save the single
    // element as an 1-D array
    const users = await this.userService.getUsersByUserId(taskDto.assignedTo);

    const task = this.taskRepo.create({
      ...taskDto,
      assignedTo: Array.isArray(users) ? users : [users],
    });

    return this.taskRepo.save(task);
  }

  async updateTaskStatus(taskId: string, userId: string, status: boolean) {
    const task = await this.taskRepo.findOneBy({ taskId });
    task.completions.find((c) => c.userId === userId).status = status;
    return this.taskRepo.save(task);
  }

  async editTask(taskId: string, editTaskDto: Partial<CreateTaskDto>) {
    const task = await this.taskRepo.findOneBy({ taskId });
    if (!task) {
      throw new BadRequestException('Task was not found');
    }
    if (!editTaskDto.assignedTo) {
      throw new BadRequestException('Must have at least one assigned user')
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
          createdBy: userId,
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
      .where(
        '(task.createdBy = :userId AND task.apartmentId = :apartmentId) OR ' +
          '(task.apartmentId = :apartmentId AND user.userId = :userId)',
        { userId, apartmentId }
      )
      .andWhere('task.dueDate >= :currentDate OR task.isRecurrent = TRUE', { currentDate: new Date().toISOString() })
      .orderBy('task.dueDate', 'DESC')
      .distinct(true) // ensure each task appears only once
      .skip(skip) // OFFSET skip
      .take(take) // LIMIT take
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
