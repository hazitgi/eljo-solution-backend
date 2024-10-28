import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QCTask } from '../entities/qc-task.entity';
import { QCChecklist } from 'src/entities/qc-checklist.entity';

import { QCChecklistFilterInput, UpdateQCChecklistInput } from './dto/UpdateQCChecklistInput';
import { CreateQCChecklistInput } from './dto/create-qcCheckList.input';

@Injectable()
export class QCChecklistService {
  constructor(
    @InjectRepository(QCChecklist)
    private qcChecklistRepository: Repository<QCChecklist>,
    @InjectRepository(QCTask)
    private qcTaskRepository: Repository<QCTask>,
  ) {}

  async create(input: CreateQCChecklistInput): Promise<QCChecklist> {
    const task = await this.qcTaskRepository.findOne({ 
      where: { id: input.taskId }
    });
    
    if (!task) {
      throw new Error('QC Task not found');
    }

    const checklist = this.qcChecklistRepository.create({
      ...input,
      task,
    });
    
    return this.qcChecklistRepository.save(checklist);
  }

  async findAll(filters?: QCChecklistFilterInput): Promise<QCChecklist[]> {
    const queryBuilder = this.qcChecklistRepository
      .createQueryBuilder('checklist')
      .leftJoinAndSelect('checklist.task', 'task');

    if (filters?.taskId) {
      queryBuilder.andWhere('task.id = :taskId', { taskId: filters.taskId });
    }

    if (filters?.category) {
      queryBuilder.andWhere('checklist.category = :category', { 
        category: filters.category 
      });
    }

    if (filters?.status) {
      queryBuilder.andWhere('checklist.status = :status', { 
        status: filters.status 
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<QCChecklist> {
    const checklist = await this.qcChecklistRepository.findOne({
      where: { id },
      relations: ['task'],
    });

    if (!checklist) {
      throw new Error('QC Checklist not found');
    }

    return checklist;
  }

  async update(
    id: number, 
    input: UpdateQCChecklistInput
  ): Promise<QCChecklist> {
    const checklist = await this.findOne(id);
    
    Object.assign(checklist, input);
    return this.qcChecklistRepository.save(checklist);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.qcChecklistRepository.delete(id);
    return result.affected > 0;
  }

  async getChecklistsByTask(taskId: number): Promise<QCChecklist[]> {
    return this.qcChecklistRepository.find({
      where: { task: { id: taskId } },
      relations: ['task'],
    });
  }
}