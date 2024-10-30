// users.service.ts
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOneOptions } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOneBy({
        email: createUserInput.email,
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
      const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
      const user = this.userRepository.create({
        ...createUserInput,
        password: hashedPassword,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      if (error.code === '23505') {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async findAll(
    role?: 'admin' | 'qc_inspector',
    name?: string,
  ): Promise<User[]> {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user');

      // Apply role filter if provided
      if (role) {
        queryBuilder.andWhere('user.role = :role', { role });
      }

      // Apply name search if provided
      if (name) {
        queryBuilder.andWhere('user.name LIKE :name', { name: `%${name}%` });
      }

      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to find all users: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error(
        `Failed to find user ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: number, updateAuthInput: UpdateUserDto): Promise<User> {
    try {
      await this.findOne(id); // ensure the user exists

      if (updateAuthInput.password) {
        updateAuthInput.password = await bcrypt.hash(
          updateAuthInput.password,
          10,
        );
      }

      await this.userRepository.update(id, updateAuthInput);
      return this.findOne(id);
    } catch (error) {
      this.logger.error(
        `Failed to update user ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.findOne(id); // ensure the user exists
      await this.userRepository.delete(id);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to remove user ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
