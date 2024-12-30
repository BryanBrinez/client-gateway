import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [NatsModule]
})
export class ChatModule { }
