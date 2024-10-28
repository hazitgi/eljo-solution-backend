import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QCTask } from '../entities/qc-task.entity';
import { CreateQCTaskInput } from './dto/create-qc.input';

@Injectable()
export class QCTaskService {
  constructor(
    @InjectRepository(QCTask)
    private qcTaskRepository: Repository<QCTask>,
  ) {}

  async create(input: CreateQCTaskInput): Promise<QCTask> {
    const task = this.qcTaskRepository.create(input);
    return this.qcTaskRepository.save(task);
  }

  async findAll(): Promise<QCTask[]> {
    return this.qcTaskRepository.find({
      relations: ['work_order', 'assignee'],
    });
  }

  async updateStatus(id: number, status: string): Promise<QCTask> {
    await this.qcTaskRepository.update(id, { status });
    return this.qcTaskRepository.findOne({ where: { id } });
  }
}
