import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskNotificationService } from './task-notification.service';

@Injectable()
export class TaskSchedulerService {
    private readonly logger = new Logger(TaskSchedulerService.name);

    constructor(
        private readonly taskNotificationService: TaskNotificationService
    ) {
        // this.handleMorningReminders();
        // this.handleEveningReminders();
        // this.handleOverdueReminders();
        // this.handleDailySummary();
        // this.handleWeeklySummary();
    }


    // Run every day at 8:00 - morning reminder for tasks due today
    @Cron('0 8 * * *', {
        name: 'morning-task-reminders',
        timeZone: 'Asia/Jerusalem'
    })
    async handleMorningReminders() {
        this.logger.log('Starting morning task reminders...');
        try {
            await this.taskNotificationService.sendDueTodayReminders();
            this.logger.log('Morning task reminders completed successfully');
        } catch (error) {
            this.logger.error('Failed to send morning task reminders:', error);
        }
    }

    // Run every day at 18:00 - evening reminder for tasks due tomorrow
    @Cron('0 18 * * *', {
        name: 'evening-task-reminders',
        timeZone: 'Asia/Jerusalem'
    })
    async handleEveningReminders() {
        this.logger.log('Starting evening task reminders...');
        try {
            await this.taskNotificationService.sendDueTomorrowReminders();
            this.logger.log('Evening task reminders completed successfully');
        } catch (error) {
            this.logger.error('Failed to send evening task reminders:', error);
        }
    }

    // Run every day at 10:00 - overdue task reminders
    @Cron('0 10 * * *', {
        name: 'overdue-task-reminders',
        timeZone: 'Asia/Jerusalem'
    })
    async handleOverdueReminders() {
        this.logger.log('Starting overdue task reminders...');
        try {
            await this.taskNotificationService.sendOverdueReminders();
            this.logger.log('Overdue task reminders completed successfully');
        } catch (error) {
            this.logger.error('Failed to send overdue task reminders:', error);
        }
    }

    // Run every day at 19:00 - daily summary
    @Cron('0 19 * * *', {
        name: 'daily-task-summary',
        timeZone: 'Asia/Jerusalem'
    })
    async handleDailySummary() {
        this.logger.log('Starting daily task summary...');
        try {
            await this.taskNotificationService.sendDailySummary();
            this.logger.log('Daily task summary completed successfully');
        } catch (error) {
            this.logger.error('Failed to send daily task summary:', error);
        }
    }

    // // Run every Sunday at 9:00 - weekly summary
    // @Cron('0 9 * * 0', {
    //     name: 'weekly-task-summary',
    //     timeZone: 'Asia/Jerusalem'
    // })
    // async handleWeeklySummary() {
    //     this.logger.log('Starting weekly task summary...');
    //     try {
    //         await this.taskNotificationService.sendDailySummary();
    //         this.logger.log('Weekly task summary completed successfully');
    //     } catch (error) {
    //         this.logger.error('Failed to send weekly task summary:', error);
    //     }
    // }
} 