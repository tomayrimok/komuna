import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  InternalServerErrorException,
  Logger,
  ParseIntPipe,
  Post,
  Query
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UseAuth } from '../decorators/UseAuth';
import { UseAuthApartment } from '../decorators/UseAuthApartment';
import { User } from '../decorators/User';
import { UserApartmentService } from '../user-apartment/user-apartment.service';
import { UserJwtPayload } from '../user/dto/jwt-user.dto';
import { UserService } from '../user/user.service';
import { AddEditTaskDto, TaskResponseDto, UpdateTaskDto } from './dto/task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly userApartmentService: UserApartmentService,
    private readonly userService: UserService
  ) { }
  private readonly logger = new Logger(TaskController.name);

  @Post('add-edit')
  @UseAuth()
  @ApiOkResponse({ type: TaskResponseDto })
  async createTask(@User() user: UserJwtPayload, @Body() taskDto: AddEditTaskDto) {
    // TODO add validation
    //TODO make sure assigned users belong to the apartment
    if (!this.userApartmentService.isUserInApartment(user.userId, taskDto.apartmentId)) {
      this.logger.error('User is not a resident of the apartment');
      throw new BadRequestException('User is not a resident of the apartment');
    }

    try {
      const task = await this.taskService.addEditTask(taskDto, user.userId)
      return task;
    } catch (error) {
      this.logger.error('Error in createTask:', error.stack);
      throw new InternalServerErrorException('Failed to create task', {
        description: 'לא הצלחנו ליצור את המשימה. אנא נסו בשנית',
      });
    }
  }

  @Post('update-completion')
  @UseAuth()
  @ApiOkResponse({ type: TaskResponseDto })
  async updateTaskCompletion(
    @User() user: UserJwtPayload,
    @Body() dto: { taskId: string; isCompleted: boolean }
  ) {
    return await this.taskService.setTaskCompletion(dto.taskId, user.userId, dto.isCompleted);
  }


  // // Task participants can only update the task's status
  // @Post('update')
  // async updateTaskStatus(
  //   @User() user: UserJwtPayload,
  //   @Body() dto: UserCompletionStatus,
  //   @Query('taskId') taskId: string
  // ) {
  //   const task = await this.taskService.getTaskById(taskId);
  //   if (!task) {
  //     throw new BadRequestException('Task was not found');
  //   } else if (!this.taskService.IsUserAParticipant(taskId, user.userId)) {
  //     throw new BadRequestException('User is not a participant of the task');
  //   } else {
  //     try {
  //       return await this.taskService.updateTaskStatus(taskId, user.userId, dto.status);
  //     } catch (error) {
  //       this.logger.error('Error in updateTaskStatus:', error.stack);
  //       throw new InternalServerErrorException('Failed to update task status', {
  //         description: 'לא הצלחנו לעדכן את המשימה. אנא נסו בשנית',
  //       });
  //     }
  //   }
  // }

  @Post('edit')
  @UseAuthApartment()
  @ApiOkResponse({ type: TaskResponseDto })
  async editTask(@User() user: UserJwtPayload, @Body() editTaskReqDto: UpdateTaskDto) {
    const task = await this.taskService.getTaskById(editTaskReqDto.taskId);
    if (task && user.userId === task.createdByUserId) {
      try {
        return await this.taskService.editTask(editTaskReqDto.taskId, { ...editTaskReqDto });
      } catch (error) {
        this.logger.error('Error in editTask:', error.stack);
        throw new InternalServerErrorException(' Failed to edit task');
      }
    }
    if (!task) {
      throw new BadRequestException('Task was not found');
    } else {
      throw new InternalServerErrorException();
    }
  }

  @Get()
  @UseAuth()
  @ApiOkResponse({ type: [TaskResponseDto] })
  async getAllTasks(@Query('apartmentId') apartmentId: string, @User() user: UserJwtPayload) {
    try {
      const tasks = await this.taskService.getTasks(user.userId, apartmentId);
      if (!tasks) {
        throw new BadRequestException('No tasks found for the given user and apartment');
      }
      // console.log('tasks: ', tasks);
      return tasks;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(error);
    }
  }

  @Get('get-by-id')
  @UseAuth()
  @ApiOkResponse({ type: TaskResponseDto })
  async getTaskById(
    @Query('taskId') taskId: string,
    @Query('apartmentId') apartmentId: string,
    @User() user: UserJwtPayload
  ) {
    const task = await this.taskService.getTaskById(taskId);
    if (!task) {
      throw new BadRequestException('Task was not found');
    }
    if (task.apartmentId !== apartmentId) {
      throw new BadRequestException('Task does not belong to the user\'s apartment');
    }
    return task;
  }

  @Get('get-completed')
  async getCompletedTasks(
    @User() user: UserJwtPayload,
    @Query('loadMultiplier', new DefaultValuePipe(0), ParseIntPipe)
    loadMultiplier: number
  ) {
    const pageSize = 100;
    const skip = loadMultiplier * pageSize;
    const take = pageSize;

    const tasks = await this.taskService.getTasks(user.userId, user.apartmentId, true, skip, take);
    return tasks;
  }
}
