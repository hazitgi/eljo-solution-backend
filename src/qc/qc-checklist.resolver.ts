import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { QCTask } from '../entities/qc-task.entity';
import { QCTaskService } from './qc.service';
import { CreateQCTaskInput } from './dto/create-qc.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { QCChecklist } from 'src/entities/qc-checklist.entity';
import { QCChecklistService } from './qc-checklist.service';
import {
  QCChecklistFilterInput,
  UpdateQCChecklistInput,
} from './dto/UpdateQCChecklistInput';
import { CreateQCChecklistInput } from './dto/create-qcCheckList.input';

@Resolver(() => QCChecklist)
export class QCChecklistResolver {
  constructor(
    private readonly qcChecklistService: QCChecklistService,
    private qcTaskService: QCTaskService,
  ) {}

  @Query(() => [QCChecklist])
  async qcChecklists(
    @Args('filters', { nullable: true }) filters?: QCChecklistFilterInput,
  ): Promise<QCChecklist[]> {
    return this.qcChecklistService.findAll(filters);
  }

  @Query(() => QCChecklist)
  async qcChecklist(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<QCChecklist> {
    return this.qcChecklistService.findOne(id);
  }

  @Mutation(() => QCChecklist)
  async createQCChecklist(
    @Args('input') input: CreateQCChecklistInput,
  ): Promise<QCChecklist> {
    return this.qcChecklistService.create(input);
  }

  @Mutation(() => QCChecklist)
  async updateQCChecklist(
    @Args('input') input: UpdateQCChecklistInput,
  ): Promise<QCChecklist> {
    return this.qcChecklistService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  async removeQCChecklist(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.qcChecklistService.remove(id);
  }

  @Query(() => [QCChecklist])
  async qcChecklistsByTask(
    @Args('taskId', { type: () => Int }) taskId: number,
  ): Promise<QCChecklist[]> {
    return this.qcChecklistService.getChecklistsByTask(taskId);
  }

  @ResolveField(() => QCTask)
  async task(@Parent() qcChecklist: QCChecklist): Promise<QCTask> {
    console.log("🚀 ~ QCChecklistResolver ~ task ~ QCChecklist:", qcChecklist.task)
    return await this.qcTaskService.findById(qcChecklist.task.id);
  }
}
