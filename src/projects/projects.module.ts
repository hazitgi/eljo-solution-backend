import { Module } from '@nestjs/common';
import { ProjectService } from './projects.service';
import { ProjectResolver } from './projects.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { WorkOrder } from 'src/entities/work-order.entity';
import { FilesModule } from 'src/files/files.module';
import { WorkOrderResolver } from './work-order.resolver';
import { WorkOrdersService } from './work-orders.service';
import { QCChecklist } from 'src/entities/qc-checklist.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, WorkOrder, QCChecklist, User]),
    FilesModule,
  ],
  providers: [
    ProjectService,
    WorkOrdersService,
    ProjectResolver,
    WorkOrderResolver,
  ],
})
export class ProjectsModule {}
