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
import { CreateTaskDto, EditTaskDto } from './dto/task.dto';
import { UserCompletionStatus } from './dto/user-completion-status.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  private readonly logger = new Logger(TaskController.name);

  @Post('create')
  async createTask(@Body() taskDto: CreateTaskDto) {
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

  // Task participants can only update the task's status
  @Post('update')
  async updateTaskStatus(@Query('userId') userId: string, @Body() dto: UserCompletionStatus) {
    const task = await this.taskService.getTaskById(dto.taskId);
    if (!task) {
      throw new BadRequestException('Task was not found');
    } else if (!this.taskService.IsUserAParticipant(dto.taskId, userId)) {
      throw new BadRequestException('User is not a participant of the task');
    } else {
      try {
        return await this.taskService.updateTaskStatus(task.taskId, userId, dto.status);
      } catch (error) {
        this.logger.error('Error in updateTaskStatus:', error.stack);
        throw new InternalServerErrorException('Failed to update task status', {
          description: 'לא הצלחנו לעדכן את המשימה. אנא נסו בשנית',
        });
      }
    }
  }

  // Only task owner can edit the task.
  @Post('edit')
  async editTask(@Query('userId') userId: string, @Body() editTaskReqDto: EditTaskDto) {
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
  async getAllTasks(@Query('userId') userId: string, @Query('apartmentId') apartmentId: string) {
    try {
      const tasks = await this.taskService.getTask(userId, apartmentId);
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
    @Query('userId') userId: string,
    @Query('apartmentId') apartmentId: string,
    @Query('loadMultiplier', new DefaultValuePipe(0), ParseIntPipe)
    loadMultiplier: number
  ) {
    const pageSize = 100;
    const skip = loadMultiplier * pageSize;
    const take = pageSize;

    const tasks = await this.taskService.getTask(userId, apartmentId, true, skip, take);
    return { success: true, tasks };
  }
}
