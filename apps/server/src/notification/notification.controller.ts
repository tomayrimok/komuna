import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UseAuth } from '../decorators/UseAuth';
import { User } from '../decorators/User';
import { UserJwtPayload } from '../user/dto/jwt-user.dto';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post('register-token')
    @UseAuth()
    registerToken(@User() user: UserJwtPayload, @Body() body: { token: string }) {
        return this.notificationService.saveToken(user.userId, body.token);
    }

}