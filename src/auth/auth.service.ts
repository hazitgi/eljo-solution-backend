import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login.input';
import { LoginResponse } from './dto/login.response';

@Injectable()
export class AuthService {
  private readonly usersRepository: Repository<User>;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {
    this.usersRepository = this.dataSource.getRepository(User);
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      const existingUser = await this.usersRepository.findOneBy({
        email: createUserInput.email,
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
      const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
      const user = this.usersRepository.create({
        ...createUserInput,
        password: hashedPassword,
      });
      delete user.password;
      return await this.usersRepository.save(user);
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      if (error.code === '23505') {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find();
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
      const user = await this.usersRepository.findOneBy({ id });
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

  async update(id: number, updateAuthInput: UpdateAuthInput): Promise<User> {
    try {
      await this.findOne(id); // ensure the user exists

      if (updateAuthInput.password) {
        updateAuthInput.password = await bcrypt.hash(
          updateAuthInput.password,
          10,
        );
      }

      await this.usersRepository.update(id, updateAuthInput);
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
      await this.usersRepository.delete(id);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to remove user ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async login(loginInput: LoginInput): Promise<LoginResponse> {
    try {
      // Find user by email
      const user = await this.usersRepository.findOne({
        where: { email: loginInput.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        loginInput.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT token
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user,
      };
    } catch (error) {
      this.logger.error(`Failed to login: ${error.message}`, error.stack);
      throw error;
    }
  }
  async validateUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
