import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    Put,
    Query,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UseAuth } from '../decorators/UseAuth';
import { User } from '../decorators/User';
import { UserJwtPayload } from '../user/dto/jwt-user.dto';
import { UserApartmentService } from '../user-apartment/user-apartment.service';
import { GeneralTaskService } from './general-task.service';
import { CreateGeneralTaskDto, UpdateGeneralTaskDto, GeneralTaskResponseDto } from './dto/general-task.dto';

@ApiTags('general-tasks')
@Controller('general-task')
export class GeneralTaskController {
    private readonly logger = new Logger(GeneralTaskController.name);

    constructor(
        private readonly generalTaskService: GeneralTaskService,
        private readonly userApartmentService: UserApartmentService,
    ) { }

    @Post('create')
    @UseAuth()
    @ApiOkResponse({ type: GeneralTaskResponseDto })
    async createGeneralTask(
        @User() user: UserJwtPayload,
        @Body() dto: CreateGeneralTaskDto
    ) {
        if (!this.userApartmentService.isUserInApartment(user.userId, dto.apartmentId)) {
            this.logger.error('User is not a resident of the apartment');
            throw new BadRequestException('User is not a resident of the apartment');
        }

        try {
            const generalTask = await this.generalTaskService.createGeneralTask(dto, user.userId);
            return generalTask;
        } catch (error) {
            this.logger.error('Error in createGeneralTask:', error.stack);
            throw new InternalServerErrorException('Failed to create general task');
        }
    }

    @Put('update')
    @UseAuth()
    @ApiOkResponse({ type: GeneralTaskResponseDto })
    async updateGeneralTask(
        @User() user: UserJwtPayload,
        @Body() dto: UpdateGeneralTaskDto
    ) {
        const existingTask = await this.generalTaskService.getGeneralTaskById(dto.generalTaskId);

        if (!existingTask) {
            throw new BadRequestException('General task not found');
        }

        try {
            const updatedTask = await this.generalTaskService.updateGeneralTask(dto);
            return updatedTask;
        } catch (error) {
            this.logger.error('Error in updateGeneralTask:', error.stack);
            throw new InternalServerErrorException('Failed to update general task');
        }
    }

    @Get()
    @UseAuth()
    @ApiOkResponse({ type: [GeneralTaskResponseDto] })
    async getGeneralTasks(
        @Query('apartmentId') apartmentId: string,
        @User() user: UserJwtPayload
    ) {
        if (!this.userApartmentService.isUserInApartment(user.userId, apartmentId)) {
            throw new BadRequestException('User is not a resident of the apartment');
        }

        try {
            const generalTasks = await this.generalTaskService.getGeneralTasks(apartmentId);
            return generalTasks;
        } catch (error) {
            this.logger.error('Error in getGeneralTasks:', error.stack);
            throw new InternalServerErrorException('Failed to fetch general tasks');
        }
    }

    @Get(':id')
    @UseAuth()
    @ApiOkResponse({ type: GeneralTaskResponseDto })
    async getGeneralTaskById(
        @Param('id') generalTaskId: string,
        @User() user: UserJwtPayload
    ) {
        const generalTask = await this.generalTaskService.getGeneralTaskById(generalTaskId);

        if (!generalTask) {
            throw new BadRequestException('General task not found');
        }

        if (!this.userApartmentService.isUserInApartment(user.userId, generalTask.apartmentId)) {
            throw new BadRequestException('User is not a resident of the apartment');
        }

        return generalTask;
    }

    @Delete(':id')
    @UseAuth()
    @ApiOkResponse()
    async deleteGeneralTask(
        @Param('id') generalTaskId: string,
        @User() user: UserJwtPayload
    ) {
        const generalTask = await this.generalTaskService.getGeneralTaskById(generalTaskId);

        if (!generalTask) {
            throw new BadRequestException('General task not found');
        }

        try {
            await this.generalTaskService.deleteGeneralTask(generalTaskId);
            return { message: 'General task deleted successfully' };
        } catch (error) {
            this.logger.error('Error in deleteGeneralTask:', error.stack);
            throw new InternalServerErrorException('Failed to delete general task');
        }
    }

    @Post('generate-tasks')
    @UseAuth()
    @ApiOkResponse()
    async manuallyGenerateTasks(@User() user: UserJwtPayload) {
        // This endpoint allows manual triggering of task generation (for testing/admin purposes)
        try {
            await this.generalTaskService.generateTasksFromGeneralTasks();
            return { message: 'Tasks generated successfully' };
        } catch (error) {
            this.logger.error('Error in manuallyGenerateTasks:', error.stack);
            throw new InternalServerErrorException('Failed to generate tasks');
        }
    }
} 