import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [TaskController],
  providers: [],
  imports: [NatsModule],
})
export class TaskModule {}
