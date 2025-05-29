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
  Res,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto, GetTaskDto } from '@komuna/types';
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

  @Post('update')
  async updateTask(@Body() ) {

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
    @Query() dto: GetTaskDto,
    @Query('loadMultiplier', new DefaultValuePipe(0), ParseIntPipe)
    loadMultiplier: number
  ) {
    const pageSize = 100;
    const skip = loadMultiplier * pageSize;
    const take = pageSize;

    const tasks = await this.taskService.getTask(
      dto.userId,
      dto.apartmentId,
      true,
      skip,
      take
    );
    return { success: true, tasks };
  }
}
