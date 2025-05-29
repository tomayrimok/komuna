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

    @Post('test')
    sendTestNotification(@Body() dto: { token: string }) {
        return this.notificationsService.sendTest(dto.token);
    }

    @Post('send')
    @UseAuth()
    sendNotification(
        @User() user: UserJwtPayload,
        @Body() body: { title: string; body: string; toUser: string }
    ) {
        return this.notificationsService.sendNotification(
            body.toUser,
            { data: { title: body.title, body: body.body } }
        );
    }
}