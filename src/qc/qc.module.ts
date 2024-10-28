import { Module } from '@nestjs/common';
import { QCTaskService } from './qc.service';
import { QCTaskResolver } from './qc.resolver';
import { QCTask } from 'src/entities/qc-task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QCChecklist } from 'src/entities/qc-checklist.entity';
import { QCChecklistService } from './qc-checklist.service';
import { QCChecklistResolver } from './qc-checklist.resolver';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([QCChecklist, QCTask, User]),
  ],
  providers: [QCChecklistService, QCChecklistResolver, QCTaskService, QCTaskResolver],
  exports: [QCChecklistService, QCTaskService],
})
export class QcModule {}
