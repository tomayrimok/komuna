import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginDto, VerifyPhoneNumberDto } from './dto/login.dto';
import { UserService } from './user.service';
import { User } from '../decorators/User';
import { UseAuth } from '../decorators/UseAuth';
import { UserJwtPayload } from './dto/jwt-user.dto';
import { isValidPhoneNumber } from 'libphonenumber-js/max';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserCreatedResponseDto, UserResponseDto } from './dto/user.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { NotificationService } from '../notification/notification.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService // Assuming you have a NotificationService for sending SMS
  ) {}
  private readonly logger = new Logger(UserController.name);

  @Post('login')
  async loginOrCreate(@Body() loginDto: LoginDto) {
    try {
      if (!loginDto.phoneNumber) {
        throw new BadRequestException("'Phone number is missing'", {
          description: 'חובה לשלוח את מספר הטלפון',
        });
      }
      const isValidPhone = isValidPhoneNumber(loginDto.phoneNumber);
      if (!isValidPhone) {
        throw new BadRequestException('Phone number is not valid', {
          description: 'מספר הטלפון שהוקש איננו תקין. אנא נסו בשנית',
        });
      }
      const code = await this.userService.updateAuthUserVerificationCode(loginDto.phoneNumber);
      await this.userService.sendVerificationSMSToPhone(loginDto.phoneNumber, code);
      return { success: true };
    } catch (error) {
      this.logger.error('Error in loginOrCreate:', error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to send verification code', {
        description: 'לא הצלחנו לשלוח את הקוד. אנא נסו בשנית',
      });
    }
  }

  @Post('verify')
  @ApiOkResponse({ type: UserCreatedResponseDto })
  async verify(@Body() body: VerifyPhoneNumberDto, @Res({ passthrough: true }) response: Response) {
    try {
      const { phoneNumber, code } = body;
      if (!phoneNumber || !code) {
        throw new BadRequestException('Phone number or code is missing', {
          description: 'חובה לשלוח את מספר הטלפון ואת הקוד',
        });
      }
      const user = await this.userService.verifyUserCode(phoneNumber, code);
      if (!user) {
        throw new BadRequestException('Invalid verification code', {
          description: 'הקוד שהוקש איננו תקין. אנא נסו בשנית',
        });
      }
      const existingUser = await this.userService.getUserByPhone(phoneNumber);
      if (existingUser) {
        const cookie = await this.userService.getAuthCookie(existingUser);
        response.setHeader('Set-Cookie', cookie);
        return { user: existingUser, isUser: true };
      }
      return { user, isUser: false };
    } catch (error) {
      this.logger.error('Error in verify:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to verify user', {
        description: 'נכשלנו לאמת את המשתמש. אנא נסו בשנית',
      });
    }
  }

  @Post()
  @ApiOkResponse({ type: UserResponseDto })
  async createUser(@Body() body: CreateUserDto, @Res({ passthrough: true }) response: Response) {
    try {
      if (!body.phoneNumber) {
        throw new BadRequestException("'Phone number is missing'", {
          description: 'חובה לשלוח את מספר הטלפון',
        });
      }
      if (!body.firstName || !body.lastName) {
        throw new BadRequestException("'First name or last name is missing'", {
          description: 'חובה לשלוח את השם הפרטי ואת שם המשפחה',
        });
      }
      const user = await this.userService.createNewUser(body);
      const cookie = await this.userService.getAuthCookie(user);
      response.setHeader('Set-Cookie', cookie);

      return { user };
    } catch (error) {
      this.logger.error('Error in creating user:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create user', {
        description: 'נכשלנו ליצור את המשתמש. אנא נסו בשנית',
      });
    }
  }

  @Get()
  @UseAuth()
  @ApiOkResponse({ type: UserResponseDto })
  async getCurrentUserProfile(@User() user: UserJwtPayload): Promise<UserResponseDto> {
    try {
      if (!user || !user.phoneNumber) {
        return { user: null };
      }
      const currentUser = await this.userService.getUserProfile(user.phoneNumber);
      return { user: currentUser };
    } catch (error) {
      this.logger.error('Error in loginOrCreate:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to get user profile', {
        description: 'נכשלנו בהבאת המשתמש הנוכחי. אנא נסו בשנית',
      });
    }
  }

  @Put()
  @UseAuth()
  @ApiOkResponse({ type: UserResponseDto })
  async updateUserProfile(@User() user: UserJwtPayload, @Body() updateData: UpdateUserDto): Promise<UserResponseDto> {
    try {
      if (!user || !user.phoneNumber) {
        throw new BadRequestException('User not authenticated');
      }

      // Update user details
      await this.userService.updateUserDetails({
        phoneNumber: user.phoneNumber,
        ...updateData,
      });

      // Fetch and return updated user profile
      const updatedUser = await this.userService.getUserProfile(user.phoneNumber);
      return { user: updatedUser };
    } catch (error) {
      this.logger.error('Error updating user profile:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update user profile', {
        description: 'כישלון במהלך עדכון הפרופיל. אנא נסו בשנית',
      });
    }
  }

  @Post('logout')
  @UseAuth()
  logout(@Res({ passthrough: true }) res: Response, @User() user: UserJwtPayload) {
    res.clearCookie('Authentication', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', // ensure this matches the cookie path
    });
    this.notificationService.deleteToken(user.userId);
    return { message: 'Logged out successfully' };
  }
}
