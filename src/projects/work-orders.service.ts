import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkOrder } from '../entities/work-order.entity';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { Project } from 'src/entities/project.entity';

@Injectable()
export class WorkOrdersService {
  constructor(
    @InjectRepository(WorkOrder)
    private workOrdersRepository: Repository<WorkOrder>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  findAll() {
    return this.workOrdersRepository.find({ relations: ['project'] });
  }

  findAllByProject(projectId: number) {
    return this.workOrdersRepository.find({ where: { projectId } });
  }

  findOne(id: number) {
    return this.workOrdersRepository.findOneBy({ id });
  }

  async create(createWorkOrderDto: CreateWorkOrderDto) {
    const project = await this.projectRepository.findOne({
      where: { id: createWorkOrderDto.projectId },
    });
    if (!project) {
      throw new Error('Project not found');
    }

    const lastWorkOrder = await this.workOrdersRepository.find({
      select: ['id'],
      order: { id: 'DESC' }, // Sort by id in descending order
      take: 1, // Limit to 1 result
    });

    createWorkOrderDto.work_order_number = this.buildWorkOrdertNumber(
      project,
      lastWorkOrder[0],
    );

    // Create workOrder and set the project
    const workOrder = this.workOrdersRepository.create({
      ...createWorkOrderDto,
    });

    const ordetData = await this.workOrdersRepository.save(workOrder);
    return ordetData;
  }

  async update(id: number, updateWorkOrderDto: CreateWorkOrderDto) {
    await this.workOrdersRepository.update(id, updateWorkOrderDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.workOrdersRepository.delete(id);
  }

  buildWorkOrdertNumber(
    project: Project,
    lastWorkOrder: WorkOrder | null,
  ): string {
    // Replace spaces with hyphens in project_name
    const project_name = project.project_name.replace(/\s+/g, '-');
    let id = lastWorkOrder ? lastWorkOrder.id : 0;
    id = ++id;
    const orderNumber = `WO-${project_name}-${id}`;
    return orderNumber;
  }
}
