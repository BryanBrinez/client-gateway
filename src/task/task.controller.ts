import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NATS_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    try {
      const user = await firstValueFrom(
        this.client.send({ cmd: 'create_task' }, createTaskDto),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const user = await firstValueFrom(
        this.client.send({ cmd: 'find_all_tasks' }, paginationDto),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await firstValueFrom(
        this.client.send({ cmd: 'find_one_task' }, id),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    try {
      const taskUpdated = await firstValueFrom(
        this.client.send(
          { cmd: 'update_task' },
          {
            id,
            ...updateTaskDto,
          },
        ),
      );
      return taskUpdated;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const user = await firstValueFrom(
        this.client.send({ cmd: 'remove_task' }, id),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
