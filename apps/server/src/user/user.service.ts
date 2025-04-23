import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async createUser(user: DeepPartial<User> = {}): Promise<User> {
        const existingUser = await this.userRepo.findOneBy({ phoneNumber: user.phoneNumber });
        if (existingUser) {
            return existingUser;
        }
        return await this.userRepo.save(user);
    }

}
