import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { WorkOrdersService } from './work-orders.service';
import { WorkOrder } from '../entities/work-order.entity';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { Project } from 'src/entities/project.entity';
import { ProjectService } from './projects.service';
import { DeleteWorkOrdertResponse } from './dto/delete-work-order-respones';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => WorkOrder)
export class WorkOrderResolver {
  constructor(
    private readonly workOrdersService: WorkOrdersService,
    private projectService: ProjectService,
  ) {}

  @Query(() => [WorkOrder], { name: 'workOrders' })
  findAll() {
    return this.workOrdersService.findAll();
  }

  @Mutation(() => WorkOrder)
  async createWorkOrder(
    @Args('createWorkOrderDto') createWorkOrderDto: CreateWorkOrderDto,
  ) {
    return this.workOrdersService.create(createWorkOrderDto);
  }

  @Query(() => WorkOrder, { name: 'workOrder' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.workOrdersService.findOne(id);
  }

  @Mutation(() => WorkOrder)
  updateWorkOrder(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateWorkOrderDto') updateWorkOrderDto: CreateWorkOrderDto,
  ) {
    return this.workOrdersService.update(id, updateWorkOrderDto);
  }

  @Mutation(() => DeleteWorkOrdertResponse)
  async removeWorkOrder(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<DeleteWorkOrdertResponse> {
    try {
      await this.workOrdersService.remove(id);
      // Construct the response object
      return {
        id,
        message: `Work order with id ${id} has been successfully removed.`,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @ResolveField(() => Project, { nullable: true })
  async project(@Parent() workOrder: WorkOrder) {
    return this.projectService.findOne(workOrder.projectId);
  }
}
