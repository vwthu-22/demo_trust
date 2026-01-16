import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    private users: User[] = [];
    private currentId = 1;

    create(createUserDto: CreateUserDto): User {
        const user: User = {
            id: this.currentId++,
            ...createUserDto,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.users.push(user);
        return user;
    }

    findAll(): User[] {
        return this.users;
    }

    findOne(id: number): User {
        const user = this.users.find((u) => u.id === id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    update(id: number, updateUserDto: UpdateUserDto): User {
        const user = this.findOne(id);
        Object.assign(user, updateUserDto);
        user.updatedAt = new Date();
        return user;
    }

    remove(id: number): void {
        const index = this.users.findIndex((u) => u.id === id);
        if (index === -1) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        this.users.splice(index, 1);
    }
}
