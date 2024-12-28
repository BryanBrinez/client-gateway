import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { NatsModule } from './transports/nats.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [UsersModule, ProjectsModule, NatsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
