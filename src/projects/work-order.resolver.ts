import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { WorkOrdersService } from './work-orders.service';
import { WorkOrder } from '../entities/work-order.entity';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { Project } from 'src/entities/project.entity';
import { ProjectService } from './projects.service';
import { DeleteWorkOrdertResponse } from './dto/delete-work-order-respones';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/dto/create-user.dto';
import { AssignWorkOrderInput } from './dto/work-order.input';

@Resolver(() => WorkOrder)
@UseGuards(GqlAuthGuard, RolesGuard)
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
  updateWorkOrder(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateWorkOrderDto') updateWorkOrderDto: CreateWorkOrderDto,
  ) {
    return this.workOrdersService.update(id, updateWorkOrderDto);
  }

  @Mutation(() => DeleteWorkOrdertResponse)
  @Roles(Role.ADMIN)
  async removeWorkOrder(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: any,
  ): Promise<DeleteWorkOrdertResponse> {
    console.log('🚀 ~ WorkOrderResolver ~ context:', context.req.user);
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

  @Mutation(() => WorkOrder)
  async assignWorkOrder(
    @Args('assignWorkOrderInput') assignWorkOrderInput: AssignWorkOrderInput,
  ): Promise<WorkOrder> {
    return this.workOrdersService.assignWorkOrder(assignWorkOrderInput);
  }

  @ResolveField(() => Project, { nullable: true })
  async project(@Parent() workOrder: WorkOrder) {
    return this.projectService.findOne(workOrder.projectId);
  }
}
