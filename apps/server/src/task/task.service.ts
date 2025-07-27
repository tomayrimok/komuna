import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { AddEditTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Task } from './task.entity';
import { NotificationService } from '../notification/notification.service';
import { TaskType, UserRole } from '@komuna/types';
import { format } from 'date-fns';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) { }

  async addEditTask(taskDto: AddEditTaskDto, userId: string): Promise<Task> {
    if (taskDto.taskId) {
      const existingTask = await this.taskRepo.findOneBy({
        taskId: taskDto.taskId,
        apartmentId: taskDto.apartmentId,
      });

      if (existingTask) {
        const updatedTask = await this.taskRepo.save({ ...existingTask, ...taskDto });

        // Send notification about task update
        try {
          this.notificationService.sendNotificationToApartment(
            taskDto.apartmentId,
            {
              notification: {
                title: 'משימה עודכנה',
                body: `המשימה "${taskDto.title}" עודכנה`
              }
            },
            [UserRole.ROOMMATE],
            userId
          );
        } catch (error) {
          console.error('Failed to send task update notification:', error);
        }

        return updatedTask;
      }
    }

    const newTask = this.taskRepo.create({
      ...taskDto,
      createdByUserId: userId,
    });

    const savedTask = await this.taskRepo.save(newTask);

    // Send notification about new task creation
    try {
      const dueDateText = taskDto.dueDate ? ` עד ${format(new Date(taskDto.dueDate), 'dd/MM/yyyy')}` : '';

      this.notificationService.sendNotificationToApartment(
        taskDto.apartmentId,
        {
          notification: {
            title: 'משימה חדשה נוצרה',
            body: `"${taskDto.title}"${dueDateText}`
          }
        },
        [UserRole.ROOMMATE],
        userId
      );
    } catch (error) {
      console.error('Failed to send new task notification:', error);
    }

    return savedTask;
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
        'task.taskType',
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

  async findTaskByTitleAndDate(apartmentId: string, title: string, dueDate: Date): Promise<Task | null> {
    return this.taskRepo.findOne({
      where: {
        apartmentId,
        title,
        dueDate,
      },
    });
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
      where: { taskId },
      relations: ['assignedTo', 'createdBy']
    });

    if (!task) throw new BadRequestException('Task not found');

    const wasCompleted = task.taskType === TaskType.GROUP
      ? task.completions.length > 0
      : task.completions.includes(userId);

    if (isCompleted) {
      if (!wasCompleted) task.completions.push(userId);
    } else {
      task.completions = task.taskType === TaskType.GROUP ? [] : task.completions.filter((c) => c !== userId);
    }

    const savedTask = await this.taskRepo.save(task);

    // Send notification about task completion status change
    if (isCompleted !== wasCompleted) {
      try {
        const user = await this.userService.getUsersByUserId(userId);
        const userName = Array.isArray(user) ?
          (user.length > 0 ? `${user[0].firstName} ${user[0].lastName}` : 'משתמש') :
          `${user.firstName} ${user.lastName}`;

        // Check if task is fully completed (for group tasks, check if all assigned users completed)
        const isFullyCompleted = task.taskType === TaskType.GROUP
          ? task.assignedTo.every(assignedUser => task.completions.includes(assignedUser.userId))
          : task.completions.length > 0;

        let notificationBody: string;
        if (isCompleted) {
          if (task.taskType === TaskType.GROUP || (task.taskType === TaskType.PERSONAL && isFullyCompleted)) {
            notificationBody = `המשימה הקבוצתית "${task.title}" הושלמה! 🎉`;
          } else if (task.taskType === TaskType.PERSONAL) {
            notificationBody = `${userName} השלים את המשימה "${task.title}"`;
          } else {
            notificationBody = `${userName} השלים את המשימה "${task.title}"`;
          }
        } else {
          notificationBody = `${userName} ביטל את השלמת המשימה "${task.title}"`;
        }

        this.notificationService.sendNotificationToApartment(
          task.apartmentId,
          {
            notification: {
              title: isCompleted ? (isFullyCompleted ? 'משימה הושלמה!' : 'עדכון משימה') : 'ביטול השלמת משימה',
              body: notificationBody
            }
          },
          [UserRole.ROOMMATE],
          userId
        );
      } catch (error) {
        console.error('Failed to send task completion notification:', error);
      }
    }

    return savedTask;
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

  async deleteTask(taskId: string, apartmentId: string) {
    const task = await this.taskRepo.findOne({ where: { taskId, apartmentId } });
    if (!task) {
      throw new BadRequestException('Task not found');
    }
    return this.taskRepo.delete(taskId);
  }
}
