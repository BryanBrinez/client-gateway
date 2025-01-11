import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [TeamController],
  providers: [],
  imports: [NatsModule],
})
export class TeamModule {}
