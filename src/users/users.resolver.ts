// users.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User)
  async getUser(@Args('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: number,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Mutation(() => Boolean)
  async removeUser(@Args('id') id: number): Promise<boolean> {
    await this.usersService.remove(id);
    return true;
  }
}
