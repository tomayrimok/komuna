import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GeneralTaskService } from './general-task.service';

@Injectable()
export class GeneralTaskSchedulerService {
    private readonly logger = new Logger(GeneralTaskSchedulerService.name);

    constructor(private readonly generalTaskService: GeneralTaskService) { }

    @Cron(CronExpression.EVERY_HOUR)
    async handleTaskGeneration() {
        this.logger.log('Running automatic task generation from general tasks');

        try {
            await this.generalTaskService.generateTasksFromGeneralTasks();
            this.logger.log('Task generation completed successfully');
        } catch (error) {
            this.logger.error('Failed to generate tasks from general tasks:', error);
        }
    }

    // // Optional: Run every day at 6 AM
    // @Cron('0 6 * * *')
    // async handleDailyTaskGeneration() {
    //     this.logger.log('Running daily task generation check');

    //     try {
    //         await this.generalTaskService.generateTasksFromGeneralTasks();
    //         this.logger.log('Daily task generation completed successfully');
    //     } catch (error) {
    //         this.logger.error('Failed to generate daily tasks from general tasks:', error);
    //     }
    // }
} 