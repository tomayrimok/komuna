import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UseAuth } from '../decorators/UseAuth';
import { User } from '../decorators/User';
import { UserJwtPayload } from '../user/dto/jwt-user.dto';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post('register-token')
    @UseAuth()
    registerToken(@User() user: UserJwtPayload, @Body() body: { token: string }) {
        return this.notificationsService.saveToken(user.userId, body.token);
    }

}