import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { LoginResponse } from './dto/login.response';
import { User } from '../entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  hello() {
    return 'Hello from GraphQL!';
  }


  @Query(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return await this.authService.login(email, password);
  }


  @Mutation(() => String)
  async requestPasswordReset(@Args('email') email: string) {
    await this.authService.resetPasswordRequest(email);
    return 'Reset instructions sent to email';
  }

  @Mutation(() => String)
  async resetPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ) {
    await this.authService.resetPassword(token, newPassword);
    return 'Password successfully reset';
  }

  
}
