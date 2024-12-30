import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { NatsModule } from './transports/nats.module';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { TaskModule } from './task/task.module';
import { ChatModule } from './chat/chat.module';


@Module({
  imports: [UsersModule, ProjectsModule, NatsModule, AuthModule, MembersModule, TaskModule, ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
