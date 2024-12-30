import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { NATS_SERVICE } from 'src/config/services';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // Habilitar CORS para todos los orígenes
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  // Manejo de conexiones
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Unirse a una sala de tarea
  @SubscribeMessage('joinTask')
  async handleJoinTask(client: Socket, taskId: string) {
    console.log(`Client ${client.id} is attempting to join task room: ${taskId}`);
    client.join(taskId);
    console.log(`Client ${client.id} joined task room: ${taskId}`);

    // Cargar los mensajes de la tarea cuando un usuario se une
    try {
      console.log(`Fetching messages for task ${taskId}`);
      const messages = await this.client.send('chat.getMessages', taskId).toPromise();
      // Enviar los mensajes existentes al cliente
      client.emit('messageHistory', messages);
      console.log(`Sent message history for task ${taskId}`);
    } catch (error) {
      console.error('Error fetching messages:', error);
      client.emit('error', { message: 'Failed to load messages.' });
    }
  }

  // Enviar mensaje
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: { taskId: string; userId: string; content: string },
  ) {
    try {
      // Envía el mensaje al microservicio de chat mediante NATS
      console.log(`Sending message to NATS for task ${payload.taskId}`);
      const result = await this.client
        .send('chat.sendMessage', payload)
        .toPromise();

      // Notifica a todos los clientes en la sala de la tarea
      console.log(`Message sent successfully for task ${payload.taskId}`);
      this.server.to(payload.taskId).emit('newMessage', result);
    } catch (error) {
      console.error('Error sending message:', error);
      client.emit('error', { message: 'Failed to send message.' });
    }
  }
}
