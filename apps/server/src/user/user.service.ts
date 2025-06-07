import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { addMinutes } from 'date-fns';
import { In, Repository } from 'typeorm';
import { generateLoginCode } from '../utils/generateVerificationCode';
import { isSMSEnabled } from '../utils/isSMSEnabled';
import { AuthUser } from './auth-user.entity';
import { UserJwtPayload } from './dto/jwt-user.dto';
import { CreateUserDto } from './dto/user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(AuthUser)
    private readonly authUserRepo: Repository<AuthUser>,
    private readonly jwtService: JwtService
  ) { }

  private readonly logger = new Logger(UserService.name);

  async updateAuthUserVerificationCode(phoneNumber: string): Promise<string> {
    let user = await this.authUserRepo.findOne({ where: { phoneNumber } });
    if (!user) {
      user = this.authUserRepo.create({ phoneNumber });
    }

    const verificationCode = generateLoginCode();
    user.verificationCode = verificationCode;
    user.verificationCodeExpiresAt = addMinutes(new Date(), 5);

    await this.authUserRepo.save(user);

    return verificationCode;
  }

  async verifyUserCode(phoneNumber: string, pincode: string): Promise<AuthUser | null> {
    const user = await this.authUserRepo.findOne({ where: { phoneNumber } });
    if (!user) throw new NotFoundException(`User with phone ${phoneNumber} not found`);

    const isExpired = user.verificationCodeExpiresAt && user.verificationCodeExpiresAt < new Date();
    if (isExpired) {
      throw new Error('Verification code has expired');
    }
    if (user.verificationCode !== pincode) {
      return null;
    }
    user.verificationCode = null;
    user.verificationCodeExpiresAt = null;
    user.isVerified = true;
    await this.authUserRepo.save(user);
    return user;
  }

  async getUserByPhone(phoneNumber: string): Promise<User | null> {
    const user = await this.userRepo.findOneBy({ phoneNumber });

    if (!user) {
      this.logger.error(`User with phone number ${phoneNumber} not found`);
      return null;
    }
    return user;
  }

  async getUserProfile(phoneNumber: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { phoneNumber },
      relations: ['apartments', 'apartments.apartment', 'landlordApartments'],
    });

    if (!user) {
      this.logger.error(`User with phone number ${phoneNumber} not found`);
      return null;
    }
    return user;
  }

  async createNewUser(user: CreateUserDto): Promise<User> {
    const authUser = await this.authUserRepo.findOneBy({ phoneNumber: user.phoneNumber });

    if (!authUser) throw new NotFoundException(`User with phone ${user.phoneNumber} not found`);
    if (!authUser.isVerified) throw new Error('User is not verified');

    const existingUser = await this.userRepo.findOneBy({ phoneNumber: user.phoneNumber });
    if (existingUser) throw new Error('User already exists');

    const newUser = this.userRepo.create(user);
    return await this.userRepo.save(newUser);
  }

  async getAuthCookie(user: User): Promise<string> {
    const { phoneNumber, userId } = user;
    const payload: UserJwtPayload = { phoneNumber, userId };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    const sevenDays = 7 * 24 * 60 * 60;

    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${sevenDays}`;

    return cookie;
  }

  // Updates user details
  async updateUserDetails(user: Partial<CreateUserDto>) {
    return await this.userRepo.update({ phoneNumber: user.phoneNumber }, user);
  }

  async sendVerificationSMSToPhone(phoneNumber: string, pincode: string) {
    if (!isSMSEnabled()) {
      this.logger.warn('SMS service is not enabled');
      return;
    }

    const ALLOWED_PHONE_NUMBERS = process.env.SMS_ALLOWED_NUMBERS?.split(',').map((item) => item.trim());

    if (!ALLOWED_PHONE_NUMBERS.includes(phoneNumber)) {
      this.logger.error(`Phone number ${phoneNumber} is not allowed to send SMS`);
      throw new Error('Phone number is not allowed to send SMS');
    }

    try {
      const auth = btoa(`${process.env.SMS_USERNAME}:${process.env.SMS_PASSWORD}`);

      const result = await axios.post(
        `http://${process.env.SMS_LOCAL_ADDRESS}/message`,
        {
          message: 'הקוד שלך לאימות באפליקציית קומונה הוא: ' + pincode,
          phoneNumbers: [phoneNumber],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
        }
      );
      return result.data;
    } catch (error) {
      this.logger.error('Error sending SMS', error);
      throw new Error('Failed to send SMS');
    }
  }

  async getUsersByUserId(userIds: string | string[]): Promise<User[] | User> {
    if (typeof userIds === 'string') {
      return this.userRepo.findOneBy({ userId: userIds });
    }
    return this.userRepo.findBy({ userId: In(userIds) });
  }
}
