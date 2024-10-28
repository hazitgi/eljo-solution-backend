import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectInput, ProjectStatus } from './dto/create-project.dto';
import { UpdateProjectInput } from './dto/update-project.input';
import { FindOptions } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async create(input: CreateProjectInput): Promise<Project> {
    // Check if project number already exists
    input.project_number = this.buildProjectNumber(input);
    const existingProject = await this.projectRepository.findOne({
      where: { project_number: input.project_number },
    });

    if (existingProject) {
      throw new Error(
        `Project with number ${input.project_number} already exists`,
      );
    }

    const project = this.projectRepository.create({
      ...input,
      status: input.status || ProjectStatus.PENDING, // Ensure status is a ProjectStatus enum
    });
    return this.projectRepository.save(project);
    
  }

  async update(id: number, input: UpdateProjectInput): Promise<Project> {
    const project = await this.findOne(id);

    // Update only the fields that are provided
    Object.assign(project, {
      ...(input.project_name && { project_name: input.project_name }),
      ...(input.status && { status: input.status }),
    });

    return this.projectRepository.save(project);
  }

  async getProjectMetrics(id: number): Promise<Project> {
    const project = await this.findOne(id);

    // Here you could add additional metrics calculation logic
    // For example, you might want to:
    // - Calculate project duration
    // - Get number of associated tasks
    // - Calculate completion percentage
    // - Get resource utilization
    // etc.

    return project;
  }

  // Additional helper methods

  async validateProjectExists(id: number): Promise<boolean> {
    const count = await this.projectRepository.count({
      where: { id },
    });
    return count > 0;
  }

  async validateProjectNumber(projectNumber: string): Promise<boolean> {
    const count = await this.projectRepository.count({
      where: { project_number: projectNumber },
    });
    return count === 0; // Returns true if project number is available
  }

  async updateStatus(id: number, status: string): Promise<Project> {
    const project = await this.findOne(id);
    
    if (!(status in ProjectStatus)) {
      throw new Error(`Invalid status: ${status}`);
    }
  
    project.status = status as ProjectStatus;
    return this.projectRepository.save(project);
  }
  

  remove(id: number) {
    return this.projectRepository.delete(id);
  }

  buildProjectNumber({
    location,
    country,
    client_name,
    project_name,
  }: {
    location: string;
    country: string;
    client_name: string;
    project_name: string;
  }): string {
    const projectNumber = `${location.substring(0, 3)} ${country.substring(
      0,
      2,
    )} ${client_name} ${project_name.replace(/[^a-zA-Z0-9]/g, '')}`;
    return projectNumber;
  }
}
