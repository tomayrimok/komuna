import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto, EditTaskReqDto, UpdateTaskReqDto } from './dto/task.dto';
import { UserJwtPayload } from '../user/dto/jwt-user.dto';
import { User } from '../decorators/User';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  private readonly logger = new Logger(TaskController.name);

  @Post('create')
  async createTask(@Body() taskDto: TaskDto) {
    // TODO add validation
    //TODO make sure assigned users belong to the apartment
    try {
      const task = await this.taskService.createTask(taskDto);
      return { success: true, task };
    } catch (error) {
      this.logger.error('Error in createTask:', error.stack);
      throw new InternalServerErrorException('Failed to create task', {
        description: 'לא הצלחנו ליצור את המשימה. אנא נסו בשנית',
      });
    }
  }

  /* Only task owner can edit the task.
  Task participants can only update if they have completed the task */
  @Post('update')
  async updateTaskStatus(@User() user: UserJwtPayload, @Body() dto: UpdateTaskReqDto) {
    const userId = user.userId;
    const task = await this.taskService.getTaskById(dto.taskId);
    let completedTask = true;

    if (!task) {
      throw new BadRequestException('Task was not found');
    }
    task.completions.forEach((participant) => {
      if (!participant.isCompleted) {
        completedTask = false;
      }
    });
    if (!this.taskService.IsUserAParticipant(dto.taskId, userId)) {
      throw new BadRequestException('User is not a participant of the task');
    } else if (completedTask) {
      throw new BadRequestException('Task is already completed by all participants');
    } else {
      try {
        return await this.taskService.updateTaskStatus(task.taskId, userId, dto.isCompleted);
      } catch (error) {
        this.logger.error('Error in updateTaskStatus:', error.stack);
        throw new InternalServerErrorException('Failed to update task status', {
          description: 'לא הצלחנו לעדכן את המשימה. אנא נסו בשנית',
        });
      }
    }
  }

  @Post('edit')
  async editTask(@User() user: UserJwtPayload, @Body() editTaskReqDto: EditTaskReqDto) {
    const userId = user.userId;
    const task = await this.taskService.getTaskById(editTaskReqDto.taskId);
    if (task && userId === task.createdBy) {
      try {
        return await this.taskService.editTask(editTaskReqDto.taskId, { ...editTaskReqDto });
      } catch (error) {
        this.logger.error('Error in editTask:', error.stack);
        throw new InternalServerErrorException(' Failed to edit task');
      }
    }
    if (!task) {
      throw new BadRequestException('Task was not found');
    } else if (task.createdBy !== userId) {
      throw new BadRequestException('Only the task creator can edit the task');
    } else {
      return { success: false };
    }
  }

  @Get('get')
  async getAllTasks(@User() user: UserJwtPayload) {
    try {
      const tasks = await this.taskService.getTask(user.userId, user.apartmentId);
      if (!tasks) {
        throw new BadRequestException('No tasks found for the given user and apartment');
      }
      return { success: true, tasks };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
    }
  }

  @Get('get-completed')
  async getCompletedTasks(
    @Query() user: UserJwtPayload,
    @Query('loadMultiplier', new DefaultValuePipe(0), ParseIntPipe)
    loadMultiplier: number
  ) {
    const pageSize = 100;
    const skip = loadMultiplier * pageSize;
    const take = pageSize;

    const tasks = await this.taskService.getTask(user.userId, user.apartmentId, true, skip, take);
    return { success: true, tasks };
  }
}
