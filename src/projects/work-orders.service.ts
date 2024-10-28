import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkOrder } from '../entities/work-order.entity';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';

@Injectable()
export class WorkOrdersService {
  constructor(
    @InjectRepository(WorkOrder)
    private workOrdersRepository: Repository<WorkOrder>,
  ) {}

  findAll() {
    return this.workOrdersRepository.find({ relations: ['project'] });
  }

  findOne(id: number) {
    return this.workOrdersRepository.findOneBy({ id });
  }

  create(createWorkOrderDto: CreateWorkOrderDto) {
    const workOrder = this.workOrdersRepository.create(createWorkOrderDto);
    return this.workOrdersRepository.save(workOrder);
  }

  async update(id: number, updateWorkOrderDto: CreateWorkOrderDto) {
    await this.workOrdersRepository.update(id, updateWorkOrderDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.workOrdersRepository.delete(id);
  }
}
