import {
  Resolver,
  Mutation,
  Args,
  Int,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { QCTask } from '../entities/qc-task.entity';
import { QCService2 } from './qc.service2';
import { CreateQCTaskWithChecklistInput } from './dto/create-qc.input2';
import { QCTaskFilterInput } from './dto/qc-filter.input';
import { QCChecklist } from 'src/entities/qc-checklist.entity';

@Resolver(() => QCTask)
export class QCResolver2 {
  constructor(private readonly qcService: QCService2) {}

  @Query(() => [QCTask])
  async qcTasks(
    @Args('filters', { nullable: true }) filters?: QCTaskFilterInput,
  ): Promise<QCTask[]> {
    return this.qcService.findAllTasks(filters);
  }

  @Query(() => QCTask)
  async qcTask(@Args('id', { type: () => Int }) id: number): Promise<QCTask> {
    return this.qcService.findTaskById(id);
  }

  @Query(() => [QCTask])
  async qcTasksByWorkOrder(
    @Args('workOrderId', { type: () => Int }) workOrderId: number,
  ): Promise<QCTask[]> {
    return this.qcService.findTasksByWorkOrder(workOrderId);
  }

  @Query(() => [QCTask])
  async qcTasksByAssignee(
    @Args('assigneeId', { type: () => Int }) assigneeId: number,
  ): Promise<QCTask[]> {
    return this.qcService.findTasksByAssignee(assigneeId);
  }

  @Query(() => [QCTask])
  async unassignedQcTasks(): Promise<QCTask[]> {
    return this.qcService.findUnassignedTasks();
  }

  // @Query(() => JSON)
  // async qcTaskStatistics(
  //   @Args('workOrderId', { type: () => Int, nullable: true })
  //   workOrderId?: number,
  // ) {
  //   return this.qcService.getTaskStatistics(workOrderId);
  // }

  @Mutation(() => QCTask)
  async createTaskWithChecklist(
    @Args('input') input: CreateQCTaskWithChecklistInput,
  ): Promise<QCTask> {
    return this.qcService.createTaskWithChecklist(input);
  }

  @Mutation(() => QCTask)
  async updateTaskWithChecklist(
    @Args('taskId', { type: () => Int }) taskId: number,
    @Args('input') input: CreateQCTaskWithChecklistInput,
  ): Promise<QCTask> {
    return this.qcService.updateTaskWithChecklist(taskId, input);
  }

  @Mutation(() => Boolean)
  async bulkDeleteQcTasks(
    @Args('ids', { type: () => [Int] }) ids: number[],
  ): Promise<boolean> {
    return this.qcService.bulkDeleteTasks(ids);
  }

  // @ResolveField(() => QCChecklist, { nullable: true })
  // async workOrders(@Parent() qcChecklist: QCChecklist) {
  //   console.log('🚀 ~ QCResolver2 ~ workOrders ~ qcChecklist:', qcChecklist);
  //   return this.qcService.findAllByTaskId(qcChecklist.id);
  // }
}
