import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WorkOrdersService } from './work-orders.service'
import { WorkOrder } from '../entities/work-order.entity';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';

@Resolver(() => WorkOrder)
export class WorkOrderResolver {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Query(() => [WorkOrder], { name: 'workOrders' })
  findAll() {
    return this.workOrdersService.findAll();
  }

  @Mutation(() => WorkOrder)
  createWorkOrder(@Args('createWorkOrderDto') createWorkOrderDto: CreateWorkOrderDto) {
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

  @Mutation(() => WorkOrder)
  removeWorkOrder(@Args('id', { type: () => Int }) id: number) {
    return this.workOrdersService.remove(id);
  }
}