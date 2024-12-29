import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [MembersController],
  providers: [],
  imports: [
      NatsModule
    ]
})
export class MembersModule {}
