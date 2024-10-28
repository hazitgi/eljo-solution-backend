import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { Project } from '../entities/project.entity';
import { ProjectService } from './projects.service';
import { CreateProjectInput } from './dto/create-project.dto';
import { UpdateProjectInput } from './dto/update-project.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { WorkOrder } from 'src/entities/work-order.entity';
import { WorkOrdersService } from './work-orders.service';

@Resolver(() => Project)
@UseGuards(GqlAuthGuard)
export class ProjectResolver {
  constructor(
    private projectService: ProjectService,
    private workOrdersService: WorkOrdersService,
  ) {}

  @Query(() => [Project])
  async projects() {
    return this.projectService.findAll();
  }

  @Query(() => Project)
  async project(@Args('id', { type: () => Int }) id: number) {
    return this.projectService.findOne(id);
  }

  @Mutation(() => Project)
  async createProject(@Args('input') input: CreateProjectInput) {
    console.log('🚀 ~ ProjectResolver ~ createProject ~ input:', input);

    return this.projectService.create(input);
  }

  @Mutation(() => Project)
  async updateProject(@Args('input') input: UpdateProjectInput) {
    return this.projectService.update(input.id, input);
  }

  @Query(() => Project) // If this returns project metrics, consider changing the return type to a custom metrics type
  async projectMetrics(@Args('id', { type: () => Int }) id: number) {
    return this.projectService.getProjectMetrics(id);
  }

  @Mutation(() => Project)
  async removeProject(@Args('id', { type: () => Int }) id: number) {
    return this.projectService.remove(id);
  }
}
