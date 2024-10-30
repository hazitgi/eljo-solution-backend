import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { LoginResponse } from './dto/login.response';
import { User } from '../entities/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  hello() {
    return 'Hello from GraphQL!';
  }

  @Query(() => User, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User) {
    return this.authService.findById(user.id);
  }

  @Query(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args("role", { type: () => String, nullable: true }) role?: 'admin' | 'qc_inspector',
  ) {
    return await this.authService.login(email, password, role);
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
