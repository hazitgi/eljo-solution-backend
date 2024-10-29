import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkOrder } from '../entities/work-order.entity';
import {
  ChecklistItemInput,
  CreateQCTaskWithChecklistInput,
  CreateWorkOrderDto,
} from './dto/create-work-order.dto';
import { Project } from 'src/entities/project.entity';
import { QCChecklist } from 'src/entities/qc-checklist.entity';
import { User } from 'src/entities/user.entity';
import { AssignWorkOrderInput } from './dto/work-order.input';

@Injectable()
export class WorkOrdersService {
  constructor(
    @InjectRepository(WorkOrder)
    private workOrdersRepository: Repository<WorkOrder>,
    @InjectRepository(QCChecklist)
    private qcChecklistRepository: Repository<QCChecklist>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.workOrdersRepository.find({
      relations: ['project', 'qcChecklist', 'qcChecklist.files', 'assignee'],
    });
  }

  findAllByProject(projectId: number) {
    return this.workOrdersRepository.find({
      where: { project: { id: projectId } },
      relations: ['project', 'qcChecklist', 'qcChecklist.files', 'assignee'],
    });
  }

  async findOne(id: number) {
    const workOrder = await this.workOrdersRepository.findOne({
      where: { id },
      relations: ['project', 'qcChecklist', 'qcChecklist.files', 'assignee'],
    });

    if (!workOrder) {
      throw new Error(`Work order with id ${id} does not exist.`);
    }

    return workOrder;
  }

  async create(createWorkOrderDto: CreateWorkOrderDto) {
    // Verify if the project exists
    const project = await this.projectRepository.findOne({
      where: { id: createWorkOrderDto.projectId },
    });
    if (!project) {
      throw new Error('Project not found');
    }

    // Generate the work order number
    const lastWorkOrder = await this.workOrdersRepository.find({
      select: ['id'],
      order: { id: 'DESC' },
      take: 1,
    });

    const workOrderNumber = this.buildWorkOrderNumber(
      project,
      lastWorkOrder[0],
    );

    let assignee;
    if (createWorkOrderDto.assigneeId) {
      assignee = await this.userRepository.findOne({
        where: { id: createWorkOrderDto.assigneeId },
      });
      if (!assignee) {
        throw new Error('Assignee not found');
      }
    }

    const workOrder = this.workOrdersRepository.create({
      work_order_number: workOrderNumber,
      project,
      sign_type: createWorkOrderDto.sign_type,
      quantity: createWorkOrderDto.quantity,
      mode: createWorkOrderDto.mode,
      assignee, // Use 'assignee' instead of 'user'
    });

    // Save the work order to obtain its ID for relations
    await this.workOrdersRepository.save(workOrder);

    // Create QC checklist items and associate with work order
    const qcChecklists = createWorkOrderDto.qcChecklist.map(
      (qcTask: CreateQCTaskWithChecklistInput) => {
        const checklistItems = qcTask.checklistItems.map(
          (item: ChecklistItemInput) =>
            this.qcChecklistRepository.create({
              category: item.category,
              parameter: item.parameter,
              status: item.status ? item.status : null,
              comments: item.comments,
              workOrder, // Associate checklist items with the saved work order
            }),
        );

        return {
          qc_type: qcTask.qc_type,

          checklistItems,
        };
      },
    );

    // Save QC checklists with nested checklist items
    for (const qcChecklist of qcChecklists) {
      await this.qcChecklistRepository.save(qcChecklist.checklistItems);
    }

    // Reload the work order with updated relations and return it
    return await this.workOrdersRepository.findOne({
      where: { id: workOrder.id },
      relations: ['qcChecklist', 'qcChecklist.files', 'assignee'], // Adjust relations as needed
    });
  }

  private buildWorkOrderNumber(
    project: Project,
    lastWorkOrder: WorkOrder,
  ): string {
    const nextOrderId = lastWorkOrder ? lastWorkOrder.id + 1 : 1;
    return `${project.project_name}-${nextOrderId.toString().padStart(5, '0')}`;
  }

  async update(id: number, updateWorkOrderDto: CreateWorkOrderDto) {
    // Check if the work order exists
    const existingWorkOrder = await this.workOrdersRepository.findOne({
      where: { id },
      relations: ['qcChecklist', 'qcChecklist.files', 'assignee'], // Include necessary relations
    });
    if (!existingWorkOrder) {
      throw new Error(`Work order with id ${id} does not exist.`);
    }

    // Update fields of the work order directly
    await this.workOrdersRepository.update(id, {
      sign_type: updateWorkOrderDto.sign_type,
      quantity: updateWorkOrderDto.quantity,
      mode: updateWorkOrderDto.mode,
    });

    // Handle QC checklist updates
    if (
      updateWorkOrderDto.qcChecklist &&
      updateWorkOrderDto.qcChecklist.length > 0
    ) {
      // Clear existing QC checklist items for the work order
      await this.qcChecklistRepository.delete({ workOrder: { id } });

      // Create and save the updated QC checklist items
      const qcChecklists = updateWorkOrderDto.qcChecklist.map(
        (qcTask: CreateQCTaskWithChecklistInput) => {
          const checklistItems = qcTask.checklistItems.map(
            (item: ChecklistItemInput) =>
              this.qcChecklistRepository.create({
                category: item.category,
                parameter: item.parameter,
                status: item.status,
                comments: item.comments,
                workOrder: existingWorkOrder, // Associate with the existing work order
              }),
          );

          return {
            qc_type: qcTask.qc_type,
            checklistItems,
          };
        },
      );

      // Save the new QC checklists with nested checklist items
      for (const qcChecklist of qcChecklists) {
        await this.qcChecklistRepository.save(qcChecklist.checklistItems);
      }
    }

    // Reload the updated work order with its relations and return it
    return await this.workOrdersRepository.findOne({
      where: { id },
      relations: ['qcChecklist', 'qcChecklist.files', 'assignee'], // Adjust relations as needed
    });
  }

  async remove(id: number): Promise<void> {
    // Find the work order with its relations
    const workOrder = await this.workOrdersRepository.findOne({
      where: { id },
      relations: ['qcChecklist'],
    });

    // Check if the work order exists
    if (!workOrder) {
      throw new Error(`Work order with id ${id} does not exist.`);
    }

    // Delete QC checklist items associated with the work order
    if (workOrder.qcChecklist && workOrder.qcChecklist.length > 0) {
      await this.qcChecklistRepository.delete({ workOrder: { id } });
    }

    // Delete the work order itself
    await this.workOrdersRepository.delete(id);
  }

  async assignWorkOrder(assignWorkOrderInput: AssignWorkOrderInput) {
    const { workOrderId, userId } = assignWorkOrderInput;

    // Retrieve the work order and check if it exists
    const workOrder = await this.workOrdersRepository.findOne({
      where: { id: workOrderId },
      relations: ['project', 'qcChecklist', 'qcChecklist.files', 'assignee'],
    });
    if (!workOrder) {
      throw new Error(`Work order with id ${workOrderId} does not exist.`);
    }

    // Retrieve the user and check if they exist
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with id ${userId} does not exist.`);
    }

    // Assign the user to the work order
    workOrder.assignee = user;
    await this.workOrdersRepository.save(workOrder);

    // Reload the work order with full relations
    return this.workOrdersRepository.findOne({
      where: { id: workOrderId },
      relations: ['project', 'qcChecklist', 'qcChecklist.files', 'assignee'],
    });
  }
  // buildWorkOrdertNumber(
  //   project: Project,
  //   lastWorkOrder: WorkOrder | null,
  // ): string {
  //   // Replace spaces with hyphens in project_name
  //   const project_name = project.project_name.replace(/\s+/g, '-');
  //   let id = lastWorkOrder ? lastWorkOrder.id : 0;
  //   id = ++id;
  //   const orderNumber = `WO-${project_name}-${id}`;
  //   return orderNumber;
  // }
}
