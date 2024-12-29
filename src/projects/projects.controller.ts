import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@Controller('projects')
export class ProjectsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.client.send({ cmd: 'create_project' }, createProjectDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'find_all_projects' }, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send({ cmd: 'find_one_project' },  id );
  }

  @Get('owner/:ownerId')
  findByOwnerId(@Param('ownerId') ownerId: string) {
    return this.client.send({ cmd: 'find_by_owner_email' },  ownerId );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.client.send({ cmd: 'update_project' }, { id, ...updateProjectDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send({ cmd: 'remove_project' }, id);
  }
}
