import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { QCStatus, QCTask } from '../entities/qc-task.entity';
import { QCTaskService } from './qc.service';
import { CreateQCTaskInput } from './dto/create-qc.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Resolver(() => QCTask)
// @UseGuards(GqlAuthGuard)
export class QCTaskResolver {
  constructor(
    private qcTaskService: QCTaskService,
    // private readonly usersService: UsersService,
  ) {}

  @Query(() => [QCTask])
  async qcTasks() {
    return this.qcTaskService.findAll();
  }

  @Mutation(() => QCTask)
  async createQCTask(@Args('input') input: CreateQCTaskInput) {
    return this.qcTaskService.create(input);
  }

  @Mutation(() => QCTask)
  async updateQCTaskStatus(
    @Args('id') id: number,
    @Args('status') status: QCStatus,
  ) {
    return this.qcTaskService.updateStatus(id, status);
  }

  @Mutation(() => QCTask)
  async assignQCTask(
    @Args('taksId') taksId: number,
    @Args('userId') userId: number,
  ) {
    return this.qcTaskService.assingTaskToUser(taksId, userId);
  }

}
