import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NATS_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { firstValueFrom } from 'rxjs';

@Controller('task')
export class TaskController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.client.send({ cmd: 'create_task' }, createTaskDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'find_all_tasks' }, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send({ cmd: 'find_one_task' }, id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {

    try {
      const taskUpdated = await firstValueFrom(this.client.send({ cmd: 'update_task' }, {
        id,
        ...updateTaskDto
      }))
      return taskUpdated

    } catch (error) {
      throw new RpcException(error)
    }

  }





  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send({ cmd: 'remove_task' }, id);
  }

  @Get('project/:projectId')
  findByOwnerId(@Param('projectId') projectId: string) {
    return this.client.send({ cmd: 'find_by_project_id' }, projectId);
  }
}
