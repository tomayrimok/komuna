import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Task } from './task.entity';
import { NotificationService } from '../notification/notification.service';
import { TaskType, UserRole } from '@komuna/types';
import { addDays, startOfDay, endOfDay, format, isSameDay } from 'date-fns';


@Injectable()
export class TaskNotificationService {
    private readonly logger = new Logger(TaskNotificationService.name);

    constructor(
        @InjectRepository(Task)
        private readonly taskRepo: Repository<Task>,
        private readonly notificationService: NotificationService
    ) { }

    // Send reminders for tasks due today
    async sendDueTodayReminders(): Promise<void> {
        const today = new Date();
        const startOfToday = startOfDay(today);
        const endOfToday = endOfDay(today);

        try {
            const tasksDueToday = await this.taskRepo.find({
                where: {
                    dueDate: Between(startOfToday, endOfToday)
                },
                relations: ['assignedTo']
            });

            this.logger.log(`Found ${tasksDueToday.length} tasks due today`);

            for (const task of tasksDueToday) {
                await this.sendTaskDueReminder(task, 'today');
            }
        } catch (error) {
            this.logger.error('Failed to send due today reminders:', error);
        }
    }

    // Send reminders for tasks due tomorrow
    async sendDueTomorrowReminders(): Promise<void> {
        const tomorrow = addDays(new Date(), 1);
        const startOfTomorrow = startOfDay(tomorrow);
        const endOfTomorrow = endOfDay(tomorrow);

        try {
            const tasksDueTomorrow = await this.taskRepo.find({
                where: {
                    dueDate: Between(startOfTomorrow, endOfTomorrow)
                },
                relations: ['assignedTo']
            });

            this.logger.log(`Found ${tasksDueTomorrow.length} tasks due tomorrow`);

            for (const task of tasksDueTomorrow) {
                await this.sendTaskDueReminder(task, 'tomorrow');
            }
        } catch (error) {
            this.logger.error('Failed to send due tomorrow reminders:', error);
        }
    }

    // Send reminders for overdue tasks
    async sendOverdueReminders(): Promise<void> {
        const today = new Date();
        const startOfToday = startOfDay(today);

        try {
            const overdueTasks = await this.taskRepo
                .createQueryBuilder('task')
                .leftJoinAndSelect('task.assignedTo', 'user')
                .where('task.dueDate < :today', { today: startOfToday })
                .getMany();

            // Filter tasks that are not fully completed
            const incompleteOverdueTasks = overdueTasks.filter(task => {
                if (task.taskType === TaskType.PERSONAL) {
                    return !task.assignedTo.every(user => task.completions.includes(user.userId));
                } else {
                    return task.completions.length === 0;
                }
            });

            console.log(`Found ${incompleteOverdueTasks.length} overdue incomplete tasks`);

            for (const task of incompleteOverdueTasks) {
                await this.sendTaskDueReminder(task, 'overdue');
            }
        } catch (error) {
            this.logger.error('Failed to send overdue reminders:', error);
        }
    }

    private async sendTaskDueReminder(task: Task, type: 'today' | 'tomorrow' | 'overdue'): Promise<void> {
        try {
            let title: string;
            let body: string;
            const taskTypeText = task.taskType === TaskType.GROUP ? 'דירתית' : 'אישית';
            const dueDateText = format(task.dueDate, 'dd/MM/yyyy');

            switch (type) {
                case 'today':
                    title = 'משימה לביצוע היום!';
                    body = `משימה ${taskTypeText}: "${task.title}" - צריכה להיות מושלמת היום (${dueDateText})`;
                    break;
                case 'tomorrow':
                    title = 'משימה לביצוע מחר';
                    body = `משימה ${taskTypeText}: "${task.title}" - צריכה להיות מושלמת מחר (${dueDateText})`;
                    break;
                case 'overdue':
                    title = 'משימה באיחור!';
                    body = `משימה ${taskTypeText}: "${task.title}" - הייתה צריכה להיות מושלמת ב-${dueDateText}`;
                    break;
            }

            // Send to all users in the apartment
            await this.notificationService.sendNotificationToApartment(
                task.apartmentId,
                {
                    notification: {
                        title,
                        body
                    }
                },
                [UserRole.ROOMMATE]
            );

            this.logger.log(`Sent ${type} reminder for task: ${task.title}`);
        } catch (error) {
            this.logger.error(`Failed to send ${type} reminder for task ${task.taskId}:`, error);
        }
    }

    // Send daily summary of pending tasks
    async sendDailySummary(): Promise<void> {
        try {
            // Get all apartments that have tasks
            const apartments = await this.taskRepo
                .createQueryBuilder('task')
                .select('DISTINCT task.apartmentId', 'apartmentId')
                .getRawMany();

            for (const { apartmentId } of apartments) {
                await this.sendApartmentTaskSummary(apartmentId);
            }
        } catch (error) {
            this.logger.error('Failed to send daily summaries:', error);
        }
    }

    private async sendApartmentTaskSummary(apartmentId: string): Promise<void> {
        try {
            const today = new Date();
            const tomorrow = addDays(today, 1);

            // Get pending tasks for today and tomorrow
            const pendingTasks = await this.taskRepo
                .createQueryBuilder('task')
                .leftJoinAndSelect('task.assignedTo', 'user')
                .where('task.apartmentId = :apartmentId', { apartmentId })
                .andWhere('task.dueDate >= :today', { today: startOfDay(today) })
                .andWhere('task.dueDate <= :tomorrow', { tomorrow: endOfDay(tomorrow) })
                .getMany();

            // Filter incomplete tasks
            const incompleteTasks = pendingTasks.filter(task => {
                if (task.taskType === TaskType.GROUP) {
                    return !task.assignedTo.every(user => task.completions.includes(user.userId));
                } else {
                    return task.completions.length === 0;
                }
            });

            const tasksToday = incompleteTasks.filter(task => isSameDay(task.dueDate, today));
            const tasksTomorrow = incompleteTasks.filter(task => isSameDay(task.dueDate, tomorrow));

            if (tasksToday.length > 0 || tasksTomorrow.length > 0) {
                let summaryText = '';

                if (tasksToday.length > 0) {
                    summaryText += `${tasksToday.length} משימות לביצוע היום`;
                }

                if (tasksTomorrow.length > 0) {
                    if (summaryText) summaryText += ', ';
                    summaryText += `${tasksTomorrow.length} משימות לביצוע מחר`;
                }

                await this.notificationService.sendNotificationToApartment(
                    apartmentId,
                    {
                        notification: {
                            title: 'סיכום משימות יומי',
                            body: summaryText
                        }
                    },
                    [UserRole.ROOMMATE]
                );

                this.logger.log(`Sent daily summary for apartment ${apartmentId}: ${summaryText}`);
            }
        } catch (error) {
            this.logger.error(`Failed to send summary for apartment ${apartmentId}:`, error);
        }
    }
} 