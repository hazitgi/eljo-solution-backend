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
    const project = await this.projectRepository.findOne({ where: { id: createWorkOrderDto.projectId } });
    if (!project) {
        throw new Error('Project not found');
    }
    createWorkOrderDto.work_order_number = this.buildWorkOrdertNumber(project);
    
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


  buildWorkOrdertNumber({
    project_name,
  }: {
    project_name: string;
  }): string {
    const orderNumber = `${project_name}-${new Date().toISOString().substring(0, 10)}`;
    return orderNumber;
  }
}
