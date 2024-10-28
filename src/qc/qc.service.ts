import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QCStatus, QCTask } from '../entities/qc-task.entity';
import { CreateQCTaskInput } from './dto/create-qc.input';
import { User } from 'src/entities/user.entity';

@Injectable()
export class QCTaskService {
  constructor(
    @InjectRepository(QCTask)
    private qcTaskRepository: Repository<QCTask>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(input: CreateQCTaskInput): Promise<QCTask> {
    const assignee = await this.userRepository.findOne({
      where: { id: input.assigneeId },
    });
    if (!assignee) {
      throw new Error(`Assignee with ID ${input.assigneeId} does not exist.`);
    }

    const qcTask = this.qcTaskRepository.create({
      ...input,
      assignee,
    });

    return this.qcTaskRepository.save(qcTask);
  }

  async findAll(): Promise<QCTask[]> {
    return this.qcTaskRepository.find({
      relations: ['work_order', 'assignee'],
    });
  }

  async updateStatus(id: number, status: QCStatus): Promise<QCTask> {
    await this.qcTaskRepository.update(id, { status });
    return this.qcTaskRepository.findOne({ where: { id } });
  }

  async findById(id: number): Promise<QCTask> {
    return await this.qcTaskRepository.findOne({ where: { id } });
  }

  async assingTaskToUser(taksId: number, userId: number): Promise<QCTask> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} does not exist.`);
    }
    
    const qcTask = await this.qcTaskRepository.findOne({
      where: { id: taksId },
    });
    if (!qcTask) {
      throw new Error(`QC Task with ID ${taksId} does not exist.`);
    }

    qcTask.assignee = user;
    return this.qcTaskRepository.save(qcTask);
  }
}
