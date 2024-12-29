import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { NATS_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('members')
export class MembersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

   @Post()
   create(@Body() createMemberDto: CreateMemberDto) {
    return this.client.send({ cmd: 'create_member' }, createMemberDto);
   }


    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
      return this.client.send({ cmd: 'find_all_members' }, paginationDto);
    }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.client.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
  //   return this.client.update(+id, updateMemberDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.client.remove(+id);
  // }
}
