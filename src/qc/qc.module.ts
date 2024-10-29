import { Module } from '@nestjs/common';
// import { QCTaskService } from './qc.service';
// import { QCTaskResolver } from './qc.resolver';
import { QCTask } from 'src/entities/qc-task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QCChecklist } from 'src/entities/qc-checklist.entity';
// import { QCChecklistService } from './qc-checklist.service';
// import { QCChecklistResolver } from './qc-checklist.resolver';
import { User } from 'src/entities/user.entity';
import { QCService2 } from './qc.service2';
import { QCResolver2 } from './qc.resolver2';
import { WorkOrder } from 'src/entities/work-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QCChecklist, QCTask, User, WorkOrder])],
  // providers: [QCChecklistService, QCChecklistResolver, QCTaskService, QCTaskResolver],
  // exports: [QCChecklistService, QCTaskService],
  providers: [QCService2, QCResolver2],
  exports: [QCService2],
})
export class QcModule {}
