import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { addMinutes } from 'date-fns';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { generateVerificationCode } from '../utils/generateVerificationCode';
import { AuthUser } from './auth-user.entity';
import { UserJwtPayload } from './dto/jwt-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(AuthUser)
    private readonly authUserRepo: Repository<AuthUser>,
    private readonly jwtService: JwtService
  ) {}

  async updateAuthUserVerificationCode(phoneNumber: string): Promise<string> {
    let user = await this.authUserRepo.findOne({ where: { phoneNumber } });
    if (!user) {
      user = this.authUserRepo.create({ phoneNumber });
    }

    const verificationCode = generateVerificationCode();
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
      Logger.error(`User with phone number ${phoneNumber} not found`);
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
}
