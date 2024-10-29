import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In, IsNull } from 'typeorm';
import { QCStatus, QCTask } from '../entities/qc-task.entity';
import { QCChecklist } from '../entities/qc-checklist.entity';
import { User } from '../entities/user.entity';
import { WorkOrder } from '../entities/work-order.entity';
import {
  CreateQCTaskWithChecklistInput,
  ChecklistItemInput,
} from './dto/create-qc.input2';
import { QCTaskFilterInput } from './dto/qc-filter.input';

@Injectable()
export class QCService2 {
  constructor(
    @InjectRepository(QCTask)
    private qcTaskRepository: Repository<QCTask>,
    @InjectRepository(QCChecklist)
    private qcChecklistRepository: Repository<QCChecklist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WorkOrder)
    private workOrderRepository: Repository<WorkOrder>,
    private dataSource: DataSource,
  ) {}

  async createTaskWithChecklist(
    input: CreateQCTaskWithChecklistInput,
  ): Promise<QCTask> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find related entities
      const assignee = await this.userRepository.findOne({
        where: { id: input.assigneeId },
      });
      if (!assignee) {
        throw new Error(`Assignee with ID ${input.assigneeId} does not exist.`);
      }

      const workOrder = await this.workOrderRepository.findOne({
        where: { id: input.workOrderId },
      });
      if (!workOrder) {
        throw new Error(
          `Work Order with ID ${input.workOrderId} does not exist.`,
        );
      }

      // Create QC Task
      const qcTask = this.qcTaskRepository.create({
        qc_type: input.qc_type,
        assignee,
        work_order: workOrder,
        status: QCStatus.PENDING,
      });

      const savedTask = await queryRunner.manager.save(qcTask);

      // Create Checklist Items
      const checklistPromises = input.checklistItems.map((item) =>
        this.createChecklistItem(queryRunner, savedTask, item),
      );

      await Promise.all(checklistPromises);
      await queryRunner.commitTransaction();

      return await this.qcTaskRepository.findOne({
        where: { id: savedTask.id },
        relations: ['work_order', 'assignee', 'qcChecklist'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async createChecklistItem(
    queryRunner: any,
    task: QCTask,
    item: ChecklistItemInput,
  ): Promise<QCChecklist> {
    const checklist = this.qcChecklistRepository.create({
      ...item,
      task,
    });
    return queryRunner.manager.save(checklist);
  }

  async updateTaskWithChecklist(
    taskId: number,
    input: CreateQCTaskWithChecklistInput,
  ): Promise<QCTask> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find existing task
      const existingTask = await this.qcTaskRepository.findOne({
        where: { id: taskId },
        relations: ['work_order', 'assignee', 'qcChecklist'],
      });
      if (!existingTask) {
        throw new Error(`QC Task with ID ${taskId} does not exist.`);
      }

      // Update task details
      const assignee = await this.userRepository.findOne({
        where: { id: input.assigneeId },
      });
      if (!assignee) {
        throw new Error(`Assignee with ID ${input.assigneeId} does not exist.`);
      }

      const workOrder = await this.workOrderRepository.findOne({
        where: { id: input.workOrderId },
      });
      if (!workOrder) {
        throw new Error(
          `Work Order with ID ${input.workOrderId} does not exist.`,
        );
      }

      // Update task
      Object.assign(existingTask, {
        qc_type: input.qc_type,
        assignee,
        work_order: workOrder,
      });

      const updatedTask = await queryRunner.manager.save(existingTask);

      // Delete existing checklist items
      await queryRunner.manager.delete(QCChecklist, { task: { id: taskId } });

      // Create new checklist items
      const checklistPromises = input.checklistItems.map((item) =>
        this.createChecklistItem(queryRunner, updatedTask, item),
      );

      await Promise.all(checklistPromises);
      await queryRunner.commitTransaction();

      return await this.qcTaskRepository.findOne({
        where: { id: taskId },
        relations: ['work_order', 'assignee', 'qcChecklist'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllTasks(filters?: QCTaskFilterInput): Promise<QCTask[]> {
    const queryBuilder = this.qcTaskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.work_order', 'work_order')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .leftJoinAndSelect('task.checklist', 'checklist');

    if (filters) {
      if (filters.workOrderId) {
        queryBuilder.andWhere('work_order.id = :workOrderId', {
          workOrderId: filters.workOrderId,
        });
      }

      if (filters.assigneeId) {
        queryBuilder.andWhere('assignee.id = :assigneeId', {
          assigneeId: filters.assigneeId,
        });
      }

      if (filters.status) {
        queryBuilder.andWhere('task.status = :status', {
          status: filters.status,
        });
      }

      if (filters.qc_type) {
        queryBuilder.andWhere('task.qc_type = :qc_type', {
          qc_type: filters.qc_type,
        });
      }

      if (filters.dateFrom && filters.dateTo) {
        queryBuilder.andWhere('task.created_at BETWEEN :dateFrom AND :dateTo', {
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
        });
      }
    }

    queryBuilder.orderBy('task.created_at', 'DESC');

    return queryBuilder.getMany();
  }

  async findTaskById(id: number): Promise<QCTask> {
    const task = await this.qcTaskRepository.findOne({
      where: { id },
      relations: ['work_order', 'assignee', 'checklist', 'checklist.files'],
    });

    if (!task) {
      throw new NotFoundException(`QC Task with ID ${id} not found`);
    }

    return task;
  }

  async findTasksByWorkOrder(workOrderId: number): Promise<QCTask[]> {
    return this.qcTaskRepository.find({
      where: { work_order: { id: workOrderId } },
      relations: ['work_order', 'assignee', 'checklist'],
      order: { created_at: 'DESC' },
    });
  }

  async findTasksByAssignee(assigneeId: number): Promise<QCTask[]> {
    return this.qcTaskRepository.find({
      where: { assignee: { id: assigneeId } },
      relations: ['work_order', 'assignee', 'checklist'],
      order: { created_at: 'DESC' },
    });
  }

  async findUnassignedTasks(): Promise<QCTask[]> {
    return this.qcTaskRepository.find({
      where: { assignee: IsNull() },
      relations: ['work_order', 'checklist'],
      order: { created_at: 'DESC' },
    });
  }

  // Delete methods with cascading options
  async deleteTask(id: number): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // First check if task exists
      const task = await this.findTaskById(id);
      if (!task) {
        throw new NotFoundException(`QC Task with ID ${id} not found`);
      }

      // Delete associated checklists first
      await queryRunner.manager.delete(QCChecklist, { task: { id } });

      // Delete the task
      await queryRunner.manager.delete(QCTask, id);

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async bulkDeleteTasks(ids: number[]): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Delete associated checklists first
      await queryRunner.manager.delete(QCChecklist, {
        task: { id: In(ids) },
      });

      // Delete the tasks
      const result = await queryRunner.manager.delete(QCTask, ids);

      await queryRunner.commitTransaction();
      return result.affected > 0;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Statistics and aggregation methods
  async getTaskStatistics(workOrderId?: number): Promise<any> {
    const queryBuilder = this.qcTaskRepository
      .createQueryBuilder('task')
      .select('task.status', 'status')
      .addSelect('COUNT(*)', 'count');

    if (workOrderId) {
      queryBuilder.where('task.work_order = :workOrderId', { workOrderId });
    }

    queryBuilder.groupBy('task.status');

    const stats = await queryBuilder.getRawMany();

    // Transform into a more usable format
    return {
      total: stats.reduce((acc, curr) => acc + parseInt(curr.count), 0),
      byStatus: stats.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.status]: parseInt(curr.count),
        }),
        {},
      ),
    };
  }
}
