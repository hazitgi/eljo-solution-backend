import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { QCTask } from '../entities/qc-task.entity';
import { QCTaskService } from './qc.service';
import { CreateQCTaskInput } from './dto/create-qc.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => QCTask)
@UseGuards(GqlAuthGuard)
export class QCTaskResolver {
  constructor(private qcTaskService: QCTaskService) {}

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
    @Args('status') status: string,
  ) {
    return this.qcTaskService.updateStatus(id, status);
  }
}
