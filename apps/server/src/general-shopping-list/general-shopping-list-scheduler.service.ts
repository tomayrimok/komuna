import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GeneralShoppingListService } from './general-shopping-list.service';

@Injectable()
export class GeneralShoppingListSchedulerService {
    private readonly logger = new Logger(GeneralShoppingListSchedulerService.name);

    constructor(
        private readonly generalShoppingListService: GeneralShoppingListService
    ) { }

    // Run every day at 6:00 AM - generate shopping lists from templates
    @Cron('0 6 * * *', {
        name: 'generate-shopping-lists',
        timeZone: 'Asia/Jerusalem'
    })
    async handleAutomaticGeneration() {
        this.logger.log('Starting automatic shopping list generation...');
        try {
            await this.generalShoppingListService.generateShoppingListsFromTemplates();
            this.logger.log('Automatic shopping list generation completed successfully');
        } catch (error) {
            this.logger.error('Failed to generate shopping lists automatically:', error);
        }
    }
} 