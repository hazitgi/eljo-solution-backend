import { Module } from '@nestjs/common';
import { QCTaskService } from './qc.service';
import { QCTaskResolver } from './qc.resolver';
import { QCTask } from 'src/entities/qc-task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([QCTask])],
  providers: [QCTaskResolver, QCTaskService],
})
export class QcModule {}
