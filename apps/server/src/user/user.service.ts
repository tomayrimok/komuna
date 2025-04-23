import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async getOrCreateUserByPhoneNumber(phoneNumber: string): Promise<{ user: User; isNew: boolean }> {
        if (!phoneNumber) throw new Error('Phone number is required to get or create user');

        const existingUser = await this.userRepo.findOneBy({ phoneNumber });
        if (existingUser) return { user: existingUser, isNew: false };

        const newUser = this.userRepo.create({ phoneNumber });
        return { user: await this.userRepo.save(newUser), isNew: true };
    }

    // Updates user details
    async updateUserDetails(user: CreateUserDto) {
        return await this.userRepo.update({ userId: user.userId }, user);
    }

    // Gets user details by userId
    async getUserById(userId: string): Promise<User> {
        const user = await this.userRepo.findOneBy({ userId });
        if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
        return user;
    }

}
