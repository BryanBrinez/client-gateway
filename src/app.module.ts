import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { NatsModule } from './transports/nats.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [UsersModule, NatsModule, AuthModule, TaskModule, TeamModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
