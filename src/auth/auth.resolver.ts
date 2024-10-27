import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { User } from '../entities/user.entity';
import { LoginResponse } from './dto/login.response';
import { LoginInput } from './dto/login.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  hello() {
    return 'Hello World!';
  }

  @Query(() => [User], { name: 'users' })
  findAllUsers(): Promise<User[]> {
    return this.authService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOneUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.authService.findOne(id);
  }

  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.authService.create(createUserInput);
  }

  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateAuthInput,
  ): Promise<User> {
    return this.authService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => Boolean)
  async removeUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return await this.authService.remove(id);
  }

  @Query(() => LoginResponse)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<LoginResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user) {
    console.log("🚀 ~ AuthResolver ~ me ~ user:", user)
    console.log("🚀 ~ AuthResolver ~ me ~ CurrentUser:", CurrentUser())
    
    // return user;
    return "Hello World!";
  }


}
