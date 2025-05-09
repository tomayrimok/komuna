import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginDto, VerifyPhoneNumberDto } from './dto/login.dot';
import { UserService } from './user.service';
import { User } from '../decorators/User';
import { UseAuth } from '../decorators/UseAuth';
import { UserJwtPayload } from './dto/jwt-user.dto';
import { isValidPhoneNumber } from 'libphonenumber-js/max';
import { CreateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
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
      await this.userService.updateAuthUserVerificationCode(loginDto.phoneNumber);
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
  async getCurrentUserProfile(@User() user: UserJwtPayload) {
    try {

      console.log(1);
      if (!user || !user.phoneNumber) {
        return { user: null };
      }
      console.log(2);

      const currentUser = await this.userService.getUserByPhone(user.phoneNumber);
      console.log(3);

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

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('Authentication', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', // ensure this matches the cookie path
    });
    return { message: 'Logged out successfully' };
  }
}
